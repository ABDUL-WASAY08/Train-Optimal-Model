import { useNavigate } from 'react-router-dom';
import { Cat, Home, ArrowLeft } from 'lucide-react';

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
        <Cat size={26} />
      </div>
      <h1 className="mt-6 text-5xl font-extrabold text-slate-900">
        40<span className="text-indigo-600">4</span>
      </h1>
      <h2 className="mt-2 text-lg font-bold text-slate-900">
        YOU LOST?
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        This page does not exist in TOM.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>

      <p className="mt-10 font-mono text-[10px] text-slate-400">
        COMSATS University Islamabad, Abbottabad Campus
      </p>
    </div>
  );
}

export default PageNotFound;