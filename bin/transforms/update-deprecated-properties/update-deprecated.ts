import { Project, SourceFile, SyntaxKind } from "ts-morph";

export function removeDeprecatedPropertyAccess(sourceFile: SourceFile): { sourceFile: SourceFile, changed: boolean } {
    
    const checker = sourceFile.getProject().getTypeChecker();
    const targets = {
        // on meeting
        joinRoom: {
            replaceWith: 'join',
            isMethod: true,
            type: 'RealtimeKitClient',
            importType: 'default'
        },
        leaveRoom: {
            replaceWith: 'leave',
            isMethod: true,
            type: 'RealtimeKitClient',
            importType: 'default'
        },
        // On participants
        active: {
            replaceWith: 'videoSubscribed',
            isMethod: false,
            type: 'RTKParticipants',
            importType: 'named',
        },
        // On single participant
        clientSpecificId: {
            replaceWith: 'customParticipantId',
            isMethod: false,
            type: 'RTKParticipant',
            importType: 'named',
        },
        // Plugin object
        enable: {
            replaceWith: 'activateForSelf',
            isMethod: false,
            type: 'RTKPlugin',
            importType: 'named',
        },
        disable: {
            replaceWith: 'deactivateForSelf',
            isMethod: false,
            type: 'RTKPlugin',
            importType: 'named',
        },
        // Permission object
        acceptPresentRequests: {
            replaceWith: 'acceptStageRequests',
            isMethod: false,
            type: 'RTKPermissionsPreset',
            importType: 'named',
        },
        canChangeParticipantRole: {
            replaceWith: 'canChangeParticipantPermissions',
            isMethod: false,
            type: 'RTKPermissionsPreset',
            importType: 'named',
        },
        produceScreenshare: {
            replaceWith: 'canProduceScreenshare',
            isMethod: false,
            type: 'RTKPermissionsPreset',
            importType: 'named',
        },
        produceAudio: {
            replaceWith: 'canProduceAudio',
            isMethod: false,
            type: 'RTKPermissionsPreset',
            importType: 'named',
        },
        
        produceVideo: {
            replaceWith: 'canProduceVideo',
            isMethod: false,
            type: 'RTKPermissionsPreset',
            importType: 'named',
        },
        // Unsupported
        // maxScreenShareCount: '',
    }
    
    let changed = false;
    
    /**
    * For direct access stuff like meeting.joinRoom()
    * meeting.leaveRoom()
    * client.joinRoom()
    * client.leaveRoom()
    */
    const props = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);
    for (const prop of props) {
        const name = prop.getName();
        const expression = prop.getExpression();
        
        const rename = targets[name];
        if (rename) {
            let typeText;
            if (rename.importType === 'default') {
                typeText = expression.getType().getSymbol().getName();
                
            } else if (rename.importType === 'named') {
                typeText = expression.getType().getText();
            }
            
            const type = checker.getTypeAtLocation(expression);
            if (typeText.includes(rename.type)) {
                prop.rename(rename.replaceWith);
                changed = true;
            }
        }
    }
    
    /**
     * For destructured types like { joinRoom: join } = meeting
     */
    const variableDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    
    for (const declaration of variableDeclarations) {
        const nameNode = declaration.getNameNode();
        const initializer = declaration.getInitializer();
        
        // Check for destructuring
        if (nameNode.getKind() === SyntaxKind.ObjectBindingPattern && initializer) {
            const bindingPattern = nameNode.asKind(SyntaxKind.ObjectBindingPattern)!;
            for (const element of bindingPattern.getElements()) {
                const name = element.getName();
                const propertyNameNode = element.getPropertyNameNode();
                const actualName = propertyNameNode?.getText() ?? name;
                
                const rename = targets[actualName];
                if (rename) {
                    let typeText;
                    if (rename.importType === 'default') {
                        typeText = initializer.getType().getSymbol().getName();
                    } else if (rename.importType === 'named') {
                        typeText = initializer.getType().getText();
                    }
                    if (typeText.includes(rename.type)) {
                        // Transform `joinRoom` to `join`, unless already aliased
                        if (!propertyNameNode) {
                            element.rename(rename.replaceWith);
                        } else {
                            propertyNameNode.replaceWithText(rename.replaceWith);
                        }
                        changed = true;
                    }
                }
            }
        }
    }
    
    
    return { sourceFile, changed };
    
}

export default async function removeAllDeprecatedProperties(tsconfigPath: string) {
    const project = new Project({
        tsConfigFilePath: tsconfigPath
    });
    const promises = [];
    for (const sourceFile of project.getSourceFiles()) {
        const result = removeDeprecatedPropertyAccess(sourceFile);
        if (result.changed) promises.push(result.sourceFile.save());
    }
    await Promise.all(promises);
}
