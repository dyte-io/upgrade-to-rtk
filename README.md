# Usage

```sh
npx @dytesdk/upgrade-to-rtk <path> # . by default
```

Ensure that the path you are running on is the parent folder containing the `package.json`

# Setting up locally

1. The best way to test is creating an expected \*.input.\* file and a corresponding expected \*.output.\* file in the `bin/transforms/__testfixtures__` folder

2. After that add the test to `bin/transforms/__tests__/dyte-to-rtk.ts`

3. Finally, running `npm t` should test your changes with all existing files and the new change you have created.

If you would like to run the codemod locally on a repo you may run,

```sh
npm i
npm run dev
cd /path/to/desired/repo
npx /path/to/upgrade-to-rtk-repo
```


# Dyte to RTK Codemod

This repository contains an executable script to update all your code references that use imports and packages from `@dytesdk/**` packages to `@cloudflare/**` packages.

The package also removes the previous dytesdk packages and installs the new cloudflare pacakges

eg.

```ts
import { DyteParticipantTile } from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";

function Meeting() {
  const { meeting } = useDyteMeeting();
  <DyteParticipantTile
    ...
    meeting={meeting}
    ...
  />;
}
```

will get automatically udpated to

```tsx
import { RtkParticipantTile } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

function Meeting() {
  const { meeting } = useRealtimeKitMeeting();
  <RtkParticipantTile
    ...
    meeting={meeting}
    ...
  />;
}
```

The script also accomodates

## Alias imports

```tsx
import {
  DyteProvider as YoloProvider,
  useDyteClient as useYoloClient,
} from "@dytesdk/react-web-core";

function App() {
  const [meeting, initMeeting] = useYoloClient();

  useEffect(() => {
    initMeeting({
      authToken: "",
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  <YoloProvider value={meeting}>
    <Meeting />
  </YoloProvider>;
}
```

gets updated to

```tsx
// @ts-nocheck
import {
  RealtimeKitProvider as YoloProvider,
  useRealtimeKitClient as useYoloClient,
} from "@cloudflare/realtimekit-react";

function App() {
  const [meeting, initMeeting] = useYoloClient();

  useEffect(() => {
    initMeeting({
      authToken: "",
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  <YoloProvider value={meeting}>
    <Meeting />
  </YoloProvider>;
}
```

## Namespace imports

```tsx
import * as DyteComponents from "@dytesdk/react-ui-kit";

function Spinner() {
  return <DyteComponents.DyteSpinner className="w-12 h-12 text-blue-600" />;
}
```

gets updated to

```tsx
import * as DyteComponents from "@cloudflare/realtimekit-react-ui";

function Spinner() {
  return <DyteComponents.RtkSpinner className="w-12 h-12 text-blue-600" />;
}
```

(You would have to change your Namespaces accordingly)

## Direct type imports

```tsx
import { DyteSidebarView } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar-ui/dyte-sidebar-ui";
import { DyteSidebarSection } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar/dyte-sidebar";
import type { DyteParticipant, DytePlugin, DyteSelf } from "@dytesdk/web-core";

function SidebarWithCustomUI() {
  const [view, setView] = useState<DyteSidebarView>("sidebar");
  const [section, setSection] = useState<DyteSidebarSection>();
  const pluginsRef = useRef<DytePlugin[]>([]);
  const screensharesRef = useRef<(DyteParticipant | DyteSelf)[]>([]);
}
```

gets updated to

```tsx
import { RtkSidebarView } from "@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar-ui/rtk-sidebar-ui";
import { RtkSidebarSection } from "@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar";
import type {
  RTKParticipant,
  RTKPlugin,
  RTKSelf,
} from "@cloudflare/realtimekit";

function SidebarWithCustomUI() {
  const [view, setView] = useState<RtkSidebarView>("sidebar");
  const [section, setSection] = useState<RtkSidebarSection>();
  const pluginsRef = useRef<RTKPlugin[]>([]);
  const screensharesRef = useRef<(RTKParticipant | RTKSelf)[]>([]);
}
```

## Event listener names

There was one case from the ui-kit where we had an event being emitted called `dyteStateUpdate` and uses of this are also updated to `rtkStateUpdate`

```tsx
document.body.addEventListener("dyteStateUpdate", handleDyteStateUpdate);
document.body.on("dyteStateUpdate", handleDyteStateUpdate);

return () => {
  document.body.removeEventListener("dyteStateUpdate", handleDyteStateUpdate);
  document.body.off("dyteStateUpdate", handleDyteStateUpdate);
};
```

gets updated to

```tsx
document.body.addEventListener("rtkStateUpdate", handleDyteStateUpdate);
document.body.on("rtkStateUpdate", handleDyteStateUpdate);

return () => {
  document.body.removeEventListener("rtkStateUpdate", handleDyteStateUpdate);
  document.body.off("rtkStateUpdate", handleDyteStateUpdate);
};
```

# Issues

The entire codemod was tested with the [dyte react samples repo](https://github.com/dyte-io/react-samples) and hence most test cases and conditions are derived from there, if you see any issues on your codebase please raise and issue! And as always PRs are welcome :)
