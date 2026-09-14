import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                <span className="font-serif text-accent-foreground text-xl font-bold">
                  M
                </span>
              </div>
              <span className="font-serif text-xl font-bold">
                MireChocolate
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Experience the rich taste of MireChocolate's artisan chocolates,
              crafted with excellence. Made with love since 2010.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded-full">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded-full">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  123 Banadir, Mogadishu, Somalia
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  (252) ....
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  info@mirechocolate.com
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded-full">
              Opening Hours
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between text-primary-foreground/70">
                <span>Monday - Friday</span>
                <span className="font-medium text-primary-foreground/90">
                  7:00 AM - 8:00 PM
                </span>
              </li>
              <li className="flex justify-between text-primary-foreground/70">
                <span>Saturday</span>
                <span className="font-medium text-primary-foreground/90">
                  8:00 AM - 9:00 PM
                </span>
              </li>
              <li className="flex justify-between text-primary-foreground/70">
                <span>Sunday</span>
                <span className="font-medium text-primary-foreground/90">
                  9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/15 mt-10 pt-6 text-center text-xs text-primary-foreground/60">
          <p className="text-center text-xs text-primary-foreground/60 py-2">
            &copy; {new Date().getFullYear()} MireChocolate. All rights reserved.
            <br />
            <span className="text-primary-foreground/40">
              Designed & developed by Omar Hassan Ali
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}