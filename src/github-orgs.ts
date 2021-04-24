import * as github from '@pulumi/github';

export const bjerkio = new github.Provider(`bjerkio-provider`, {
  owner: 'bjerkio',
  organization: 'bjerkio',
});
export const basssene = new github.Provider(`basssene-provider`, {
  owner: 'basssene',
  organization: 'basssene',
});
