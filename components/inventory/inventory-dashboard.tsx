import { FC } from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const InventoryDashboard: FC = () => {
  const router = useRouter();
  return (
    <Box>
      <Heading>Inventory Dashboard</Heading>
      <Flex>
        <Button onClick={() => router.push('/inventory/items')}>Items</Button>
        <Button onClick={() => router.push('/inventory/receiving')}>Receiving</Button>
        <Button onClick={() => router.push('/inventory/issuance')}>Issuance</Button>
        <Button onClick={() => router.push('/inventory/adjustments')}>Adjustments</Button>
        <Button onClick={() => router.push('/inventory/stock-count')}>Stock Count</Button>
        <Button onClick={() => router.push('/inventory/reorder')}>Reorder</Button>
      </Flex>
    </Box>
  );
};

export default InventoryDashboard;