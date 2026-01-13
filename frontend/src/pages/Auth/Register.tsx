import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useRegisterhook } from '@/hooks/user.hook'
import { registerSchema, type RegisterFormData } from '@/@Types/user.types'
import {  PenTool, User, Mail, UserPlus, Scan } from 'lucide-react'

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })
  
  const { mutate: registerMutate, isPending } = useRegisterhook()
  
  const registerFormHandler = (data: RegisterFormData) => {
    registerMutate(data)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            DrawSpace
          </h1>
          <p className="text-gray-600">Join the creative revolution</p>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit(registerFormHandler)} 
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
        >
          <div className="space-y-6">
            {/* Username */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/20 outline-none ${
                  errors.username 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-emerald-400'
                }`}
                placeholder="Choose a creative username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input 
                type="email" 
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/20 outline-none ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-emerald-400'
                }`}
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Password
              </label>
              <input 
                type="password" 
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/20 outline-none ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-emerald-400'
                }`}
                placeholder="Create a strong password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <PenTool className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!isValid || isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/" 
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
