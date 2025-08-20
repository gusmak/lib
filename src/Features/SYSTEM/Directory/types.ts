import type { ObjectInputType } from 'Features/types';
import { Directory as DirectoryBase, Workflow as WorkflowBase, WorkflowMatrix as WorkflowMatrixBase } from 'AWING/DirectoryForm/types';

/** Directory Root */
export type Directory = DirectoryBase;

export type Workflow = WorkflowBase;

export type WorkflowMatrix = WorkflowMatrixBase;

export type DirectoryInput = ObjectInputType<Directory>;
