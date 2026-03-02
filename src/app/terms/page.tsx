import Link from "next/link";

export default function TermsPage() {
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
          Términos y Condiciones
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-text-secondary [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-primary [&_p]:leading-relaxed">
          <p>
            <strong>Última actualización:</strong> 1 de marzo de 2026
          </p>

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma IA Vanguard, aceptas estos
            términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte
            de estos términos, no debes usar nuestros servicios.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
            Ofrecemos cursos en línea, libros digitales y bundles de contenido educativo
            relacionados con la inteligencia artificial y la tecnología. El acceso al
            contenido se otorga de forma digital tras completar el pago correspondiente.
          </p>

          <h2>3. Cuentas de Usuario</h2>
          <p>
            Para acceder al contenido, debes crear una cuenta proporcionando información
            veraz y actualizada. Eres responsable de mantener la seguridad de tu cuenta
            y contraseña. No debes compartir tus credenciales con terceros.
          </p>

          <h2>4. Compras y Pagos</h2>
          <p>
            Los precios están expresados en dólares estadounidenses (USD). Los pagos se
            procesan a través de PayPal. Una vez completada la compra, tendrás acceso
            inmediato al contenido adquirido.
          </p>

          <h2>5. Política de Reembolso</h2>
          <p>
            Ofrecemos una garantía de devolución de 30 días. Si no estás satisfecho con
            tu compra, puedes solicitar un reembolso completo dentro de los 30 días
            posteriores a la fecha de compra.
          </p>

          <h2>6. Propiedad Intelectual</h2>
          <p>
            Todo el contenido (videos, textos, materiales, libros) es propiedad de
            IA Vanguard y está protegido por leyes de derechos de autor.
            No se permite la redistribución, copia o reventa del contenido sin
            autorización expresa.
          </p>

          <h2>7. Licencia de Uso</h2>
          <p>
            Al adquirir un curso o libro, recibes una licencia personal, no transferible
            y no exclusiva para acceder y consumir el contenido con fines educativos
            personales.
          </p>

          <h2>8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios serán notificados a través de la plataforma y entrarán en vigor
            al momento de su publicación.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, puedes contactarnos a través
            de nuestra plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
