// ============================================
// components/layouts/UserLayout.jsx
// ============================================
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;