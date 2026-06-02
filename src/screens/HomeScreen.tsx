import { Button, Pill, ScrollContainer, Text, usePreferredFocus } from 'mrbd-ui-kit';
import { Star } from 'lucide-react';
import { Counter } from '../components/Counter';

const ITEMS = ['Buttons', 'Cards', 'Spatial focus', 'Scrolling lists', 'Pills & text'];

export function HomeScreen() {
  // Declare the preferred initial focus target for this screen.
  usePreferredFocus('counter-inc');

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Text as="h1" size="lg" weight="bold" className="block">
            MRBD App
          </Text>
          <Text size="sm" className="block text-gray-400">
            Glanceable starter for the Display.
          </Text>
        </div>
        <Pill>Template</Pill>
      </div>

      <Counter />

      <Text size="sm" weight="semibold" className="block">
        What you get
      </Text>

      {/* ScrollContainer fills the remaining height and scrolls with Up/Down */}
      <ScrollContainer>
        {ITEMS.map((label, i) => (
          <Button key={label} id={`item-${i}`} icon={Star} className="w-full justify-start">
            {label}
          </Button>
        ))}
      </ScrollContainer>
    </div>
  );
}
