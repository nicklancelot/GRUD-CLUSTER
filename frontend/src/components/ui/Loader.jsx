import Spinner from './Spinner'

function Loader({ message = 'Chargement des données...' }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-[24px] px-6 py-16 text-center">
      <Spinner size="lg" className="border-slate-200 border-t-sky-600" />
      <p className="mt-4 text-sm text-slate-500">{message}</p>
    </div>
  )
}

export default Loader
