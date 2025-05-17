/**
* Codemod: dyte-to-rtk
*
* This script updates Dyte SDK imports to the new RealtimeKit (RTK) packages.
*
* Supported transformations:
* - Namespace imports (e.g., import * as Dyte from 'pkg')
* - Named imports (e.g., import { DyteButton } from 'pkg')
* - Deep type imports (e.g., from dist/types/...)
* - Identifier usages throughout the code
* - JSX attribute renaming (e.g., onDyteUpdate → onRtkUpdate)
* - Types in annotations and generics (e.g., useState<DyteUser>)
* - Utility types like Omit<HTMLDyte...>
*/
import { Transform } from "jscodeshift";


const transform: Transform = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    
    const PACKAGE_MAPPINGS = [
        {
            from: '@dytesdk/react-ui-kit',
            to: '@cloudflare/realtimekit-react-ui',
            prefix: 'Dyte',
            replacement: 'Rtk',
        },
        {
            from: '@dytesdk/react-web-core',
            to: '@cloudflare/realtimekit-react',
            prefix: 'Dyte',
            replacement: 'RealtimeKit',
        },
        {
            from: '@dytesdk/ui-kit',
            to: '@cloudflare/realtimekit-ui',
            prefix: 'Dyte',
            replacement: 'Rtk',
        },
        {
            from: '@dytesdk/web-core',
            to: '@cloudflare/realtimekit',
            prefix: 'Dyte',
            replacement: 'RTK',
        },
    ];
    
    const renamedIdentifiers = new Map();
    
    // Replace identifiers in type annotations
    function updateTypeName(typeName) {
        if (!typeName) return;
        switch (typeName.type) {
            case 'Identifier':
            const oldName = typeName.name;
            if (renamedIdentifiers.has(oldName)) {
                typeName.name = renamedIdentifiers.get(oldName);
            } else if (oldName.startsWith('HTMLDyte')) {
                typeName.name = oldName.replace('HTMLDyte', 'HTMLRtk')
            }
            break;
            
            case 'TSTypeReference':
            updateTypeName(typeName.typeName);
            break;
            
            case typeName.type === 'TSQualifiedName':
            updateTypeName(typeName.left);
            updateTypeName(typeName.right);
            break;
            
            case 'TSUnionType':
            case 'TSIntersectionType':
            typeName.types.forEach(updateTypeName);
            break;
            
            case 'TSArrayType':
            case 'TSParenthesizedType':
            updateTypeName(typeName.elementType || typeName.typeAnnotation);
            break;
            
        }
    }
    
    // Utility: Update member expressions on namespace imports
    function updateMemberUsages(namespace, prefix, replacement) {
        root.find(j.MemberExpression, {
            object: { type: 'Identifier', name: namespace },
            property: { type: 'Identifier' },
        }).forEach(path => {
            const prop = path.node.property;
            if (prop.type === 'Identifier' && prop.name.includes(prefix)) {
                prop.name = prop.name.replace(prefix, replacement);
            }
        });
        
        root.find(j.JSXMemberExpression, {
            object: { type: 'JSXIdentifier', name: namespace },
            property: { type: 'JSXIdentifier' },
        }).forEach(path => {
            const prop = path.node.property;
            if (prop.name.includes(prefix)) {
                prop.name = prop.name.replace(prefix, replacement);
            }
        });
    }
    
    // Replace imports and track renamed identifiers
    PACKAGE_MAPPINGS.forEach(({ from, to, prefix, replacement }) => {
        const isTargetImport = (value) => value === from || value.startsWith(`${from}/`);
        
        root.find(j.ImportDeclaration)
        .filter(path => isTargetImport(path.node.source.value))
        .forEach(path => {
            if (typeof path.node.source.value === 'string') {
                path.node.source.value = path.node.source.value.replace(from, to).replaceAll('/dyte-', '/rtk-');
            }
            
            path.node.specifiers.forEach(spec => {
                if (spec.type === 'ImportNamespaceSpecifier') {
                    const namespace = spec.local.name;
                    updateMemberUsages(namespace, prefix, replacement);
                }
                
                if (spec.type === 'ImportSpecifier') {
                    const importedName = spec.imported.name;
                    if (typeof importedName === 'string' && importedName.includes(prefix)) {
                        const newName = importedName.replace(prefix, replacement);
                        renamedIdentifiers.set(importedName, newName);
                        spec.imported.name = newName;
                        
                        if (typeof spec.local.name !== 'string' && spec.local.name.name === importedName) {
                            spec.local.name.name = newName;
                        }
                    }
                }
            });
        });
    });
    
    // Rename all identifiers across the file
    renamedIdentifiers.forEach((newName, oldName) => {
        root.find(j.Identifier, { name: oldName })
        .forEach(path => {
            const parent = path.parent.node;
            if (!j.ImportSpecifier.check(parent) &&
            !j.ImportDefaultSpecifier.check(parent) &&
            !j.ImportNamespaceSpecifier.check(parent)) {
                path.node.name = newName;
            }
        });
    });
    
    // Rename JSX attributes like onDyte... -> onRtk...
    root.find(j.JSXAttribute)
    .forEach(attr => {
        if (typeof attr.node.name.name === 'string') {
            PACKAGE_MAPPINGS.forEach(({ prefix, replacement }) => {
                if (typeof attr.node.name.name === 'string' && attr.node.name.name.includes(prefix)) {
                    attr.node.name.name = attr.node.name.name.replace(prefix, replacement);
                }
            });
        }
    });
    
    // Replace types in annotations like useState<DyteUser>
    root.find(j.TSTypeReference)
    .forEach(path => {
        updateTypeName(path.node.typeName);
        if (path.node.typeParameters) {
            path.node.typeParameters.params.forEach(param => {
                if (param.type === 'TSTypeReference') {
                    updateTypeName(param.typeName);
                }
            });
        }
    });
    
    // Replace types in utility types like Omit<...>
    root.find(j.TSTypeReference)
    .forEach(path => {
        j(path).find(j.TSTypeReference).forEach(inner => {
            updateTypeName(inner.node.typeName);
            
            if (inner.node.typeParameters) {
                inner.node.typeParameters.params.forEach(param => {
                    if (param.type === 'TSTypeReference') {
                        updateTypeName(param.typeName);
                    }
                });
            }
        });
    });
    
    root.find(j.CallExpression)
    .forEach(path => {
        // @ts-ignore
        if (path.node.typeParameters) path.node.typeParameters.params.forEach(updateTypeName);
        
        const callee = path.node.callee;
        if (
            j.MemberExpression.check(callee) &&
            j.Identifier.check(callee.property) && ['addEventListener', 'removeEventListener', 'on', 'off'].includes(callee.property.name)
        ) {
            const args = path.node.arguments;
            if (args.length > 0 && j.Literal.check(args[0]) && typeof args[0].value === 'string') {
                const strVal = args[0].value;
                if (strVal.includes('dyteStateUpdate')) {
                    args[0].value = strVal.replace(/dyteStateUpdate/, 'rtkStateUpdate');
                }
            }
        }
    });
    
    
    /**
    * Renaming deprecated methods and variables from web-core 2.x
    */
    // Collect meeting identifiers from hooks
    const dyteHooks = {
        useDyteMeeting: 'useRealtimeKitMeeting',
        useDyteSelector: 'useRealtimeKitSelector'
    };
    // Replace method/property access based on tracked bindings
    const replacements = [
        ['joinRoom', 'join'],
        ['leaveRoom', 'leave'],
        ['participants.active', 'participants.videoSubscribed'],
        ['participants.disableAudio\(([^)]+)\)', 'participants.joined.get($1).disableAudio()'],
        ['participants.disableVideo\(([^)]+)\)', 'participants.joined.get($1).disableVideo()'],
        ['participants.kick\(([^)]+)\)', 'participants.joined.get($1).kick()'],
        ['plugin.enable', 'plugin.activateForSelf'],
        ['plugin.disable', 'plugin.deactivateForSelf'],
        ['permissions.acceptPresentRequests', 'permissions.acceptStageRequests'],
        ['permissions.maxScreenShareCount', 'config.maxScreenShareCount'],
        ['permissions.canChangeParticipantRole', 'permissions.canChangeParticipantPermissions'],
        ['permissions.produceAudio', 'permissions.canProduceAudio'],
        ['permissions.produceScreenshare', 'permissions.canProduceScreenshare'],
        ['permissions.produceVideo', 'permissions.canProduceVideo'],
        ['participant.clientSpecificId', 'participant.customParticipantId']
    ];
    
    return root.toSource({ quote: 'single' });
};

export default transform;
