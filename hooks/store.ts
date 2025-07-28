import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import backendApi from "./backend-api"

export const store = configureStore({
  reducer: {
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // RTK Query actions that contain non-serializable values
          "persist/PERSIST",
          "persist/REHYDRATE",
        ],
      },
    }).concat(backendApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
