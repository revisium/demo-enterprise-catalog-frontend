import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { QuotePageViewModel } from '../../model/QuotePageViewModel';

export const QuotePage = observer(function QuotePage() {
  const [vm] = useState(() => new QuotePageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid gap={{ base: '5', lg: '6' }} templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}>
          <Stack
            bg="surface.900"
            borderRadius="8px"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
            color="white"
            gap="4"
            p={{ base: '4', md: '5' }}
          >
            <Text
              color="darkPanelMutedText"
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
            >
              Sales inquiry
            </Text>
            <Heading as="h1" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              Request a HelioStack server quote.
            </Heading>
            <Text color="darkPanelText" fontSize="md">
              Tell us where you want to run and which server plan you are evaluating. A specialist
              can follow up with availability, pricing, and setup guidance.
            </Text>
            <Stack gap="2" pt="2">
              {['Regional availability', 'Contract pricing', 'Setup guidance'].map((item) => (
                <Badge
                  alignSelf="start"
                  bg="darkBadgeBg"
                  borderRadius="8px"
                  color="white"
                  key={item}
                  px="3"
                  py="1.5"
                >
                  {item}
                </Badge>
              ))}
            </Stack>
          </Stack>

          <Stack
            as="form"
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            boxShadow="panel"
            gap="4"
            onSubmit={vm.submit}
            p={{ base: '4', md: '5' }}
          >
            <Stack as="label" gap="1.5">
              <Text color="ink.700" fontWeight="650">
                Company
              </Text>
              <chakra.input
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
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
                borderColor="surface.200"
                borderRadius="8px"
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
            <Grid gap="4" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Region
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.form.controls.region.setValue(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.region.value}
                  w="100%"
                >
                  {vm.regionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Interest
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) =>
                    vm.form.controls.interest.setValue(event.currentTarget.value)
                  }
                  p="3"
                  value={vm.form.controls.interest.value}
                  w="100%"
                >
                  {vm.interestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
            </Grid>
            <Button alignSelf="start" bg="ctaBg" borderRadius="8px" color="white" type="submit">
              Submit request
            </Button>
            {vm.submitted ? (
              <Text color="successText" fontWeight="700">
                Request captured. A HelioStack specialist will follow up with regional guidance.
              </Text>
            ) : null}
            {vm.submitError ? (
              <Text color="red.700" fontWeight="700">
                {vm.submitError}
              </Text>
            ) : null}
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});
