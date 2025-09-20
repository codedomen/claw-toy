import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const MainAppStoreModel = types
  .model("MainAppStore")
  .props({
    application: types.string,
  })
  .actions(withSetPropAction)

export interface MainAppStore extends Instance<typeof MainAppStoreModel> {}
export interface MainAppStoreSnapshot extends SnapshotOut<typeof MainAppStoreModel> {}
