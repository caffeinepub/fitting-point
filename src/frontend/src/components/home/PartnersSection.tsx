export default function PartnersSection() {
  return (
    <section className="section-spacing bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-gold mb-4">
          Our Trusted Partners
        </h2>
        <p className="text-center text-muted-foreground font-body text-lg mb-12">
          Working with the best to serve you better
        </p>
        <div className="relative overflow-hidden rounded-xl border border-gold/10 bg-card p-8">
          <img
            src="/assets/generated/partners-logos-strip.dim_2400x400.png"
            alt="Our trusted partners"
            className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>
    </section>
  );
}
