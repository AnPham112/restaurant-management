import authApiRequest from '@/apiRequests/auth'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  console.log('dasdsadsa')
  return useMutation({
    mutationFn: authApiRequest.cLogin,
  })
}
