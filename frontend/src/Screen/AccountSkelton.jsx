import React from 'react'

function AccountSkelton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white border border-slate-200 shadow-card rounded-2xl p-6 md:p-8 space-y-8">

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-200 pb-6">
          
          <div className="w-24 h-24 rounded-full skeleton" />

          
          <div className="flex-1 w-full space-y-3 pt-2 text-center sm:text-left">
            <div className="h-7 w-48 skeleton mx-auto sm:mx-0" />
            <div className="h-4 w-72 skeleton mx-auto sm:mx-0" />
            <div className="h-3 w-32 skeleton mx-auto sm:mx-0 mt-2" />
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
         
          <div className="space-y-2.5">
            <div className="h-4 w-28 skeleton" />
            <div className="h-11 w-full skeleton" />
          </div>

        
          <div className="space-y-2.5">
            <div className="h-4 w-28 skeleton" />
            <div className="h-11 w-full skeleton" />
          </div>

          <div className="space-y-2.5 md:col-span-2">
            <div className="h-4 w-20 skeleton" />
            <div className="h-28 w-full skeleton" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <div className="h-11 w-36 skeleton" />
        </div>

      </div>
    </div>
  )
}

export default AccountSkelton