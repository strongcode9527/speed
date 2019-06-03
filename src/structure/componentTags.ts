const componentTags: ComponentTag = {
  HostText: 'text',
  HostRoot: 'root',
  HostComponent: 'host',
  FunctionalComponent: 'function',
  ClassComponent: 'class',
};

export default componentTags;

export interface ComponentTag {
  HostText: string;
  HostRoot: string;
  HostComponent: string;
  FunctionalComponent: string;
  ClassComponent: string;
};