import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold gradient-text">
          Política de Privacidad
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-text-secondary [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-primary [&_p]:leading-relaxed">
          <p>
            <strong>Última actualización:</strong> 1 de marzo de 2026
          </p>

          <h2>1. Información que Recopilamos</h2>
          <p>
            Recopilamos la siguiente información cuando te registras y usas nuestra
            plataforma:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Nombre completo y dirección de email</li>
            <li>Información de perfil (imagen, si usas inicio de sesión social)</li>
            <li>Datos de compra y transacciones</li>
            <li>Progreso en cursos y actividad en la plataforma</li>
            <li>Reviews y comentarios que publiques</li>
          </ul>

          <h2>2. Uso de la Información</h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Proporcionar acceso al contenido adquirido</li>
            <li>Gestionar tu cuenta y autenticación</li>
            <li>Procesar pagos y emitir recibos</li>
            <li>Enviar comunicaciones sobre tu cuenta</li>
            <li>Mejorar nuestros servicios y experiencia de usuario</li>
          </ul>

          <h2>3. Almacenamiento de Datos</h2>
          <p>
            Tus datos se almacenan de forma segura en servidores de Supabase (PostgreSQL),
            con cifrado en tránsito y en reposo. Las contraseñas se almacenan usando
            hash bcrypt y nunca se guardan en texto plano.
          </p>

          <h2>4. Compartición de Datos</h2>
          <p>
            No vendemos ni compartimos tu información personal con terceros, excepto:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Procesadores de pago:</strong> PayPal recibe los datos necesarios
              para procesar transacciones.
            </li>
            <li>
              <strong>Proveedores de autenticación:</strong> Si usas Google para iniciar
              sesión, Google procesa la autenticación.
            </li>
            <li>
              <strong>Requerimientos legales:</strong> Cuando sea necesario por ley.
            </li>
          </ul>

          <h2>5. Cookies y Sesiones</h2>
          <p>
            Usamos cookies esenciales para mantener tu sesión activa. No usamos cookies
            de rastreo ni publicidad de terceros.
          </p>

          <h2>6. Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Acceder a tus datos personales</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de tu cuenta y datos</li>
            <li>Exportar tus datos en formato portable</li>
          </ul>

          <h2>7. Seguridad</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger
            tu información, incluyendo cifrado SSL/TLS, hash de contraseñas, y controles
            de acceso basados en roles.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Para ejercer tus derechos o consultas sobre privacidad, contáctanos a través
            de nuestra plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
