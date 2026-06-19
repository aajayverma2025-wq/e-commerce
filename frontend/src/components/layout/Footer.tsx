import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">MegaMart</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vendor/login" className="hover:text-white transition-colors">Vendor Portal</Link></li>
              <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold">Visa</span>
              <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold">Mastercard</span>
              <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold">eSewa</span>
              <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold">Khalti</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MegaMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
