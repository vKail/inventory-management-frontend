import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Notification region placeholder */}
      <div
        role="region"
        aria-label="Notifications (F8)"
        tabIndex={-1}
        style={{ pointerEvents: "none" }}
      >
        <ol
          tabIndex={-1}
          className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        ></ol>
      </div>
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white shadow">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">GITT</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Gestión de Inventario Talleres Tecnológicos - UTA
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          href="/login"
        >
          Iniciar Sesión
        </Link>
      </header>
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-8 py-20 max-w-7xl mx-auto">
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            GITT - Control total de los talleres tecnológicos
          </h2>
          <p className="text-lg text-muted-foreground">
            Un sistema institucional diseñado para la Universidad Técnica de Ambato. Registra, presta y localiza los recursos tecnológicos de forma eficiente, moderna y segura.
          </p>
          <Link
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
            href="/login"
          >
            Empezar ahora
          </Link>
        </div>
        <div className="max-w-md w-full">
          <img
            src="https://tallertecnologicouta1.wordpress.com/wp-content/uploads/2022/04/20220422_1020391.jpg"
            alt="Inventario"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>
      </section>
      <div className="w-full h-[3px] bg-primary/40 mb-16"></div>
      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            ¿Qué puedes hacer con GITT?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            GITT te brinda acceso completo a las herramientas necesarias para gestionar el inventario de los talleres de manera inteligente.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl border bg-muted text-center shadow-sm space-y-4">
            {/* Box SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes w-10 h-10 mx-auto text-primary"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path><path d="m7 16.5-4.74-2.85"></path><path d="m7 16.5 5-3"></path><path d="M7 16.5v5.17"></path><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path><path d="m17 16.5-5-3"></path><path d="m17 16.5 4.74-2.85"></path><path d="M17 16.5v5.17"></path><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path><path d="M12 8 7.26 5.15"></path><path d="m12 8 4.74-2.85"></path><path d="M12 13.5V8"></path></svg>
            <h4 className="text-xl font-semibold text-gray-800">Gestión de productos</h4>
            <p className="text-muted-foreground text-sm">
              Registra y visualiza equipos, herramientas y dispositivos. Cada ítem tiene estado, ubicación, código único y detalles técnicos.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 rounded-xl border bg-muted text-center shadow-sm space-y-4">
            {/* Scan SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-line w-10 h-10 mx-auto text-primary"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></svg>
            <h4 className="text-xl font-semibold text-gray-800">Ubicación con escaneo</h4>
            <p className="text-muted-foreground text-sm">
              Usa el código para escanear productos y ubícalos instantáneamente dentro del sistema. Perfecto para seguimiento y control.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 rounded-xl border bg-muted text-center shadow-sm space-y-4">
            {/* Settings SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-10 h-10 mx-auto text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <h4 className="text-xl font-semibold text-gray-800">Configuración personalizada</h4>
            <p className="text-muted-foreground text-sm">
              Crea categorías, define ubicaciones, condiciones y almacenes. Administra usuarios y roles si se necesita.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full text-center py-6 text-sm text-muted-foreground bg-white">
        © 2025 Universidad Técnica de Ambato · Sistema GITT
      </footer>
    </div>
  );
}
