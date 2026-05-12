import type { TaskType } from '../../types/api/TaskTypes.ts';
import {
  Badge,
  Button,
  Card,
  Code,
  Flex,
  Inset,
  Progress,
  Text,
} from '@radix-ui/themes';
import IconWithBackground from '../icons/base/IconWithBackground.tsx';
import { ClockIcon } from '@radix-ui/react-icons';

interface TaskCardProps {
  task: TaskType;
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card size="2" className="h-auto! px-(--space-6)!" asChild>
      <Button variant="surface">
        <Inset clip="padding-box" side="top" pb="current" mx="-4">
          <Progress variant="soft" value={50} color="orange" size="1" />
        </Inset>
        <Flex direction="row" justify="between" align="center" gap="6">
          <Flex direction="row" justify="center" align="center" gap="6">
            <IconWithBackground
              data-testid="status-icon"
              icon={ClockIcon}
              color="orange"
              className="size-(--space-7) rounded-(--radius-2)"
              iconClassName="size-(--space-6)"
            />
            <Flex direction="column" justify="center" align="start" gap="2">
              <Code variant="soft" size="2">
                #{task.id}
              </Code>
              <Text
                size="5"
                weight="medium"
                align="left"
                className="text-(--gray-12)"
              >
                {task.title}
              </Text>
              <Text size="2" className="text-(--gray-11)">
                {task.user.email}
              </Text>
            </Flex>
          </Flex>
          <Badge size="3" variant="surface" color="orange" radius="small">
            In progress
          </Badge>
        </Flex>
      </Button>
    </Card>
  );
};

export default TaskCard;
