// Mock resources data. Shaped to match the future resources table.

export interface MockResource {
  id: string;
  title: string;
  kind: 'doc' | 'video' | 'link' | 'download';
  url: string | null;
}

export const MOCK_RESOURCES: MockResource[] = [
  { id: 'res-1', title: '[Placeholder] Onboarding handbook', kind: 'doc', url: null },
  { id: 'res-2', title: '[Placeholder] Style guide', kind: 'link', url: null },
];
