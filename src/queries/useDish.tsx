import dishApiRequest from '@/apiRequests/dish'
import { QueryKey, QueryOptions } from '@/constants/type'
import {
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useDishListQuery = (options?: QueryOptions<DishListResType>) => {
  return useQuery({
    queryKey: [QueryKey.DISHES],
    queryFn: dishApiRequest.list,
    ...options,
  })
}

export const useGetDishQuery = ({
  id,
  enabled,
  ...options
}: {
  id: number
  enabled: boolean
} & QueryOptions<DishResType>) => {
  return useQuery({
    queryKey: [QueryKey.DISHES, id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled,
    ...options,
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DISHES],
      })
    },
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DISHES],
        exact: true,
      })
    },
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DISHES],
      })
    },
  })
}
