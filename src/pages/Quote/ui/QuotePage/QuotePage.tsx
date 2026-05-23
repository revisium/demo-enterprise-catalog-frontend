import { Button, Container, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { QuotePageViewModel } from '../../model/QuotePageViewModel';

export const QuotePage = observer(function QuotePage() {
  const [vm] = useState(() => new QuotePageViewModel());

  return (
    <Container maxW="1240px" px="4" py={{ base: '8', md: '16' }}>
      <Stack as="header" gap="4">
        <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
          Runtime interaction
        </Text>
        <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1">
          Request quote mock form powered by @revisium/forms-core.
        </Heading>
        <Text color="ink.500" fontSize="lg" maxW="720px">
          This form does not call the backend yet. It proves the frontend form contract and keeps
          runtime interaction ownership separate from Revisium catalog data.
        </Text>
      </Stack>

      <Stack
        as="form"
        bg="white"
        borderRadius="panel"
        borderWidth="1px"
        boxShadow="panel"
        gap="4"
        maxW="680px"
        mt="8"
        onSubmit={vm.submit}
        p="4"
      >
        <Stack as="label" gap="1.5">
          <Text color="ink.700" fontWeight="650">
            Company
          </Text>
          <chakra.input
            bg="white"
            borderColor="blackAlpha.300"
            borderRadius="control"
            borderWidth="1px"
            onBlur={() => vm.form.controls.company.blur()}
            onChange={(event) => vm.form.controls.company.setValue(event.currentTarget.value)}
            p="3"
            value={vm.form.controls.company.value}
            w="100%"
          />
          <Text color="red.700" fontSize="sm" minH="5">
            {vm.form.controls.company.visibleError}
          </Text>
        </Stack>
        <Stack as="label" gap="1.5">
          <Text color="ink.700" fontWeight="650">
            Work email
          </Text>
          <chakra.input
            bg="white"
            borderColor="blackAlpha.300"
            borderRadius="control"
            borderWidth="1px"
            onBlur={() => vm.form.controls.email.blur()}
            onChange={(event) => vm.form.controls.email.setValue(event.currentTarget.value)}
            p="3"
            value={vm.form.controls.email.value}
            w="100%"
          />
          <Text color="red.700" fontSize="sm" minH="5">
            {vm.form.controls.email.visibleError}
          </Text>
        </Stack>
        <Stack as="label" gap="1.5">
          <Text color="ink.700" fontWeight="650">
            Region
          </Text>
          <chakra.select
            bg="white"
            borderColor="blackAlpha.300"
            borderRadius="control"
            borderWidth="1px"
            onChange={(event) => vm.form.controls.region.setValue(event.currentTarget.value)}
            p="3"
            value={vm.form.controls.region.value}
            w="100%"
          >
            <option>North America</option>
            <option>Europe</option>
            <option>APAC</option>
          </chakra.select>
        </Stack>
        <Stack as="label" gap="1.5">
          <Text color="ink.700" fontWeight="650">
            Interest
          </Text>
          <chakra.select
            bg="white"
            borderColor="blackAlpha.300"
            borderRadius="control"
            borderWidth="1px"
            onChange={(event) => vm.form.controls.interest.setValue(event.currentTarget.value)}
            p="3"
            value={vm.form.controls.interest.value}
            w="100%"
          >
            <option>Edge Gateway X4</option>
            <option>Sentinel Vibration Node</option>
            <option>Nexora Observe Pro</option>
          </chakra.select>
        </Stack>
        <Button alignSelf="start" bg="brand.500" borderRadius="control" color="white" type="submit">
          Submit mock request
        </Button>
        {vm.submitted ? (
          <Text color="brand.500" fontWeight="700">
            Mock request captured. Backend ownership will start from this stable contract.
          </Text>
        ) : null}
        {vm.submitError ? (
          <Text color="red.700" fontWeight="700">
            {vm.submitError}
          </Text>
        ) : null}
      </Stack>
    </Container>
  );
});
