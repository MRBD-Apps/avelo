import { Button, Card, Text } from 'mrbd-ui-kit';
import { ExternalLink } from 'lucide-react';

export function AboutScreen() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <Text as="h1" size="lg" weight="bold" className="block">
        About
      </Text>

      <Card className="flex flex-col gap-1">
        <Text>Built with mrbd-ui-kit for Meta Ray-Ban Display.</Text>
        <Text size="sm" className="text-gray-400">
          600×600 · additive display · spatial navigation.
        </Text>
      </Card>

      {/* `asChild` merges Button styles onto a child element (here a link). */}
      <Button id="docs-link" icon={ExternalLink} variant="secondary" asChild>
        <a
          href="https://github.com/michaelcummings12/mrbd-ui-kit"
          target="_blank"
          rel="noreferrer"
        >
          UI kit docs
        </a>
      </Button>
    </div>
  );
}
