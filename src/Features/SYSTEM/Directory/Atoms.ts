import { atom } from 'jotai';
import { type Directory } from './types';

export const directoriesState = atom<Directory[]>([]);
