import { defineTest } from "jscodeshift/dist/testUtils";

describe('Named imports', () => {

  describe('react-ui-kit import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'react-ui-kit', { parser: 'tsx' });
  });
  
  describe('react-web-core import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'react-web-core', { parser: 'tsx' });
  });
  
  describe('both react-ui-kit and react-web-core import changes', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'react-ui-and-core', { parser: 'tsx' });
  });
  
});

describe('Alias imports', () => {
  
  describe('react-ui-kit import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'alias-imports-react-ui-kit', { parser: 'tsx' });
  });
  
  describe('react-web-core import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'alias-imports-react-web-core', { parser: 'tsx' });
  });
  
  describe('both react-ui-kit and react-web-core import changes', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'alias-imports-react-ui-and-core', { parser: 'tsx' });
  });
});

describe('Namespaced imports', () => {
  describe('react-ui-kit import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'namespace-imports-react-ui-kit', { parser: 'tsx' });
  });

  describe('react-web-core import changes only', () => {
      defineTest(__dirname, 'dyte-to-rtk', null, 'namespace-imports-react-web-core', { parser: 'tsx' });
  });
});

describe('Simple ts test', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'simple-ts-file', { parser: 'ts' })
})

describe('Simple js test', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'simple-js-file')
})

describe('Vanilla html usage', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'vanilla-html-usage', { parser: 'tsx' })
})

describe('Direct type imports', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'direct-type-imports', { parser: 'tsx' })
})

describe('Event listeners using dyteStateUpdate', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'listeners-for-dyteStateUpdate', { parser: 'tsx' })
})

describe('Comprehensive test', () => {
  defineTest(__dirname, 'dyte-to-rtk', null, 'comprehensive', { parser: 'tsx' })
})
