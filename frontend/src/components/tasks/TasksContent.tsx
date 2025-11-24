import { TaskType } from '../../types/api/TaskTypes.ts';
import { Flex } from '@radix-ui/themes';

interface TasksContentProps {
  tasks: TaskType[];
}

const TasksContent = ({ tasks }: TasksContentProps) => {
  return (
    <Flex direction="column" gap="2">
      {tasks.map((task) => (
        <div key={task.id}>{task.id}</div>
      ))}
    </Flex>
  );
};

export default TasksContent;
