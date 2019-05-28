const componentTags: ComponentTag = {
  HostText: 6,
  HostRoot: 'root',
  HostComponent: 'host',
  FunctionalComponent: 1,
  ClassComponent: 'class',
};

export default componentTags;

export interface ComponentTag {
  HostText: number;
  HostRoot: string;
  HostComponent: string;
  FunctionalComponent: number;
  ClassComponent: string;
};