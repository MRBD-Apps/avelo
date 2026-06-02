import { useState } from 'react';
import { DisplayRoot, Button } from 'mrbd-ui-kit';
import { Home, Info } from 'lucide-react';

import { HomeScreen } from './screens/HomeScreen';
import { AboutScreen } from './screens/AboutScreen';

type Screen = 'home' | 'about';

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Info },
] as const;

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <DisplayRoot>
      <div
        className="flex flex-col bg-black text-mrbd-text"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {screen === 'home' ? <HomeScreen /> : <AboutScreen />}
        </div>

        {/* Bottom dock — kit <Button>s as icon-only circles, D-pad navigable */}
        <nav className="flex shrink-0 items-center justify-center gap-2 py-3">
          {NAV.map((item) => (
            <Button
              key={item.id}
              id={`nav-${item.id}`}
              variant={screen === item.id ? 'secondary' : 'ghost'}
              size="lg"
              icon={item.icon}
              autoFocus={false}
              onClick={() => setScreen(item.id)}
              className="h-14 w-14 rounded-full p-0"
            >
              <span className="sr-only">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </DisplayRoot>
  );
}
