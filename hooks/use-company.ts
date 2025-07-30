import backendApi from "./backend-api"

// Company types matching backend model
export interface Company {
  id: string
  companyName: string
  companyAddress: string
  companyTelephone: string
  companyLogo?: string
  ownerFullName: string
  ownerEmail: string
  ownerAddress: string
  ownerPhone: string
  numberOfShares: number
  companyCategory:
    | "technology"
    | "finance"
    | "healthcare"
    | "manufacturing"
    | "retail"
    | "services"
    | "energy"
    | "real_estate"
    | "agriculture"
    | "transportation"
    | "other"
  status: "pending" | "approved" | "rejected"
  registeredBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCompanyRequest {
  companyName: string
  companyAddress: string
  companyTelephone: string
  ownerFullName: string
  ownerEmail: string
  ownerAddress: string
  ownerPhone: string
  numberOfShares: number
  companyCategory: Company["companyCategory"]
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string
}

export interface UpdateCompanyStatusRequest {
  id: string
  status: Company["status"]
}

// Form data interface for UI (includes fields not in backend model)
export interface CompanyFormData {
  companyName: string
  companyAddress: string
  companyTelephone: string
  companyLogo?: string
  ownerFullName: string
  ownerEmail: string
  ownerAddress: string
  ownerPhone: string
  numberOfShares: number
  companyCategory: string
  description?: string // UI only field
  email?: string // UI only field (maps to ownerEmail)
}

// Transform form data to backend payload
const transformFormDataToPayload = (formData: CompanyFormData): FormData => {
  const payload = new FormData()

  // Map form fields to backend fields
  payload.append("companyName", formData.companyName)
  payload.append("companyAddress", formData.companyAddress)
  payload.append("companyTelephone", formData.companyTelephone)
  payload.append("ownerFullName", formData.ownerFullName)
  payload.append("ownerEmail", formData.ownerEmail)
  payload.append("ownerAddress", formData.ownerAddress)
  payload.append("ownerPhone", formData.ownerPhone)
  payload.append("numberOfShares", formData.numberOfShares.toString())
  payload.append("companyCategory", formData.companyCategory)

  // Add file if present
  if (formData.companyLogo) {
    payload.append("profile", formData.companyLogo)
  }

  return payload
}

const companiesApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query<Company[], void>({
      query: () => "/api/companies",
      transformResponse: (response: { success: boolean; result: Company[] }) => response.result,
      providesTags: ["Companies"],
    }),

    getCompanyById: builder.query<Company, string>({
      query: (id) => `/api/companies/${id}`,
      transformResponse: (response: { success: boolean; result: Company }) => response.result,
      providesTags: (result, error, id) => [{ type: "Companies", id }],
    }),

    getMyCompanies: builder.query<Company[], void>({
      query: () => "/api/companies/my/companies",
      transformResponse: (response: { success: boolean; result: Company[] }) => response.result,
      providesTags: ["MyCompanies"],
    }),

    createCompany: builder.mutation<{ success: boolean; result: Company }, CompanyFormData>({
      query: (formData) => ({
        url: "/api/companies",
        method: "POST",
        body: transformFormDataToPayload(formData),
      }),
      invalidatesTags: ["Companies"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            // Update getAllCompanies cache with new company
            dispatch(
              companiesApi.util.updateQueryData("getAllCompanies", undefined, (draft) => {
                if (draft) {
                  draft.push(data.result)
                }
              }),
            )
          }
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),

    updateCompany: builder.mutation<{ success: boolean; result: Company }, { id: string; formData: CompanyFormData }>({
      query: ({ id, formData }) => ({
        url: `/api/companies/${id}`,
        method: "PUT",
        body: transformFormDataToPayload(formData),
      }),
      invalidatesTags: (result, error, { id }) => ["Companies", "MyCompanies", { type: "Companies", id }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            // Update getAllCompanies cache
            dispatch(
              companiesApi.util.updateQueryData("getAllCompanies", undefined, (draft) => {
                if (draft) {
                  const index = draft.findIndex((company) => company.id === id)
                  if (index !== -1) {
                    draft[index] = data.result
                  }
                }
              }),
            )
            // Update getMyCompanies cache
            dispatch(
              companiesApi.util.updateQueryData("getMyCompanies", undefined, (draft) => {
                if (draft) {
                  const index = draft.findIndex((company) => company.id === id)
                  if (index !== -1) {
                    draft[index] = data.result
                  }
                }
              }),
            )
          }
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),

    deleteCompany: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Companies", "MyCompanies", { type: "Companies", id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Remove company from getAllCompanies cache
          dispatch(
            companiesApi.util.updateQueryData("getAllCompanies", undefined, (draft) => {
              if (draft) {
                const index = draft.findIndex((company) => company.id === id)
                if (index !== -1) {
                  draft.splice(index, 1)
                }
              }
            }),
          )
          // Remove company from getMyCompanies cache
          dispatch(
            companiesApi.util.updateQueryData("getMyCompanies", undefined, (draft) => {
              if (draft) {
                const index = draft.findIndex((company) => company.id === id)
                if (index !== -1) {
                  draft.splice(index, 1)
                }
              }
            }),
          )
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),

    updateCompanyStatus: builder.mutation<{ success: boolean; result: Company }, UpdateCompanyStatusRequest>({
      query: ({ id, status }) => ({
        url: `/api/companies/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ["Companies", "MyCompanies", { type: "Companies", id }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            // Update company status in getAllCompanies cache
            dispatch(
              companiesApi.util.updateQueryData("getAllCompanies", undefined, (draft) => {
                if (draft) {
                  const index = draft.findIndex((company) => company.id === id)
                  if (index !== -1) {
                    draft[index] = data.result
                  }
                }
              }),
            )
            // Update company status in getMyCompanies cache
            dispatch(
              companiesApi.util.updateQueryData("getMyCompanies", undefined, (draft) => {
                if (draft) {
                  const index = draft.findIndex((company) => company.id === id)
                  if (index !== -1) {
                    draft[index] = data.result
                  }
                }
              }),
            )
          }
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetMyCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyStatusMutation,
} = companiesApi
