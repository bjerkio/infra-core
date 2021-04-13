import * as github from '@pulumi/github';

export const bjerkio = new github.Provider(`bjerkio-provider`, {
  organization: 'bjerkio',
});
export const basssene = new github.Provider(`basssene-provider`, {
  organization: 'basssene',
});
