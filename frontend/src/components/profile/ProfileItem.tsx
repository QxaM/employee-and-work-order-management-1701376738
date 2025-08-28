import { DataList, Skeleton } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

interface ProfileItemProps {
  isLoading: boolean;
  title?: string;
}

const ProfileItem = ({
  isLoading,
  title,
  children,
}: PropsWithChildren<ProfileItemProps>) => {
  return (
    <DataList.Item>
      {title && <DataList.Label className="uppercase">{title}</DataList.Label>}
      <Skeleton loading={isLoading}>
        <DataList.Value className="font-(--font-weight-bold) text-(length:--font-size-3)">
          {children}
        </DataList.Value>
      </Skeleton>
    </DataList.Item>
  );
};

export default ProfileItem;
