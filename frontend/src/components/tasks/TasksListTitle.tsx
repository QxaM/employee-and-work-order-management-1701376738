import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import IconWithBackground from '../icons/base/IconWithBackground.tsx';
import { Pencil2Icon } from '@radix-ui/react-icons';

interface TasksListTitleProps {
  totalTasks: number;
}

const TasksListTitle = ({ totalTasks }: TasksListTitleProps) => {
  return (
    <Card size="4" variant="classic">
      <Flex direction="row" justify="between" align="center">
        <Flex direction="row" justify="center" align="center" gap="2">
          <IconWithBackground
            icon={Pencil2Icon}
            iconClassName="size-(--space-7)"
            className="size-(--space-8) rounded-(--radius-3)"
          />
          <Flex direction="column">
            <Heading as="h2" size="6">
              Tasks
            </Heading>
            <Text size="2">
              Select task below to view and update its details
            </Text>
          </Flex>
        </Flex>
        <Text size="2" color="gray">
          Total Tasks: {totalTasks}
        </Text>
      </Flex>
    </Card>
  );
};

export default TasksListTitle;
