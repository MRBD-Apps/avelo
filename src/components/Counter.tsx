import { useState } from 'react';
import { Button, Card, Text } from 'mrbd-ui-kit';
import { Plus } from 'lucide-react';
import { formatCount } from '../lib/format';

/**
 * Example interactive component using the kit's <Button>.
 * Kit buttons activate on the Display via Enter / temple-touch (the focus engine
 * wires onClick to "select"), so they're driven by D-pad, not mouse.
 */
export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Card className="flex items-center justify-between">
      <div className="flex flex-col">
        <Text weight="semibold">Counter</Text>
        <Text size="sm" className="text-gray-400">{formatCount(count)}</Text>
      </div>
      <Button id="counter-inc" icon={Plus} variant="primary" onClick={() => setCount((c) => c + 1)}>
        Add
      </Button>
    </Card>
  );
}
