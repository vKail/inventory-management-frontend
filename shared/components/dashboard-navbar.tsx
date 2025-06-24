'use client';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarItems } from '../data/sidebar-items';
import { useAuthStore } from '@/features/auth/context/auth-store';
import { useState, useRef, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const DashboardNavbar = () => {
  const params = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ title: string; href: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extraer todas las pantallas del sidebar
  const allScreens = sidebarItems.flatMap(group =>
    group.items.flatMap(item =>
      item.subItems.map(sub => ({
        title: `${sub.title} - ${item.title}`,
        href: sub.href,
      }))
    )
  );

  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allScreens.filter(screen =>
      screen.title.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
    setShowDropdown(filtered.length > 0);
  }, [search]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const title =
    sidebarItems
      .find(item =>
        item.items.some(subItem => subItem.subItems.some(subSubItem => subSubItem.href === params))
      )
      ?.items.find(item => item.subItems.some(subSubItem => subSubItem.href === params))?.title ||
    'Dashboard';
  const { user } = useAuthStore();

  return (
    <header className="border-b p-4 bg-background flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative md:block hidden" ref={inputRef}>
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-[300px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(results.length > 0)}
            autoComplete="off"
          />
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
              {results.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">No hay resultados</div>
              ) : (
                results.map(screen => (
                  <button
                    key={screen.href + screen.title}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearch('');
                      router.push(screen.href);
                    }}
                  >
                    <span className="block">{screen.title}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{screen.href}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.userName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.userName || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground">{user?.userType || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
