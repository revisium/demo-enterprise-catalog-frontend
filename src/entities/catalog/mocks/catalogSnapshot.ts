import type { CatalogSnapshot } from '../model/catalogTypes';

export const catalogSnapshot: CatalogSnapshot = {
  products: [
    {
      id: 'edge-gateway-x4',
      name: 'Edge Gateway X4',
      family: 'Industrial edge',
      category: 'Gateways',
      summary:
        'Rugged gateway for plant-floor telemetry, protocol translation, and secure cloud forwarding.',
      imageAlt: 'Rugged industrial edge gateway with four protected ports',
      availability: 'Available in NA, EU, and APAC',
      protocols: ['OPC UA', 'Modbus TCP', 'MQTT', 'REST'],
      specs: {
        enclosure: 'DIN rail aluminum enclosure',
        ingress: 'IP54',
        operatingRange: '-20C to 70C',
        connectivity: 'Dual Ethernet, LTE option, Wi-Fi 6',
      },
      documents: ['Datasheet', 'Installation manual', 'EU declaration'],
      metrics: [
        { label: 'List price', value: '$1,240' },
        { label: 'Lead time', value: '3 weeks' },
        { label: 'Warranty', value: '36 months' },
      ],
    },
    {
      id: 'sentinel-vibration-node',
      name: 'Sentinel Vibration Node',
      family: 'Condition monitoring',
      category: 'Sensors',
      summary:
        'Wireless vibration and temperature sensor for rotating equipment monitoring programs.',
      imageAlt: 'Compact wireless vibration sensor mounted on industrial equipment',
      availability: 'Available in NA and EU',
      protocols: ['BLE', 'MQTT', 'LoRaWAN'],
      specs: {
        enclosure: 'Sealed polymer puck',
        ingress: 'IP67',
        operatingRange: '-30C to 85C',
        connectivity: 'BLE provisioning, LoRaWAN telemetry',
      },
      documents: ['Datasheet', 'Battery safety note', 'Calibration certificate'],
      metrics: [
        { label: 'List price', value: '$410' },
        { label: 'Lead time', value: '2 weeks' },
        { label: 'Battery', value: '5 years' },
      ],
    },
    {
      id: 'nexora-observe-pro',
      name: 'Nexora Observe Pro',
      family: 'Cloud monitoring',
      category: 'SaaS plans',
      summary:
        'Managed observability plan with fleet dashboards, alert routing, retention, and partner APIs.',
      imageAlt: 'Operational monitoring dashboard with device health charts',
      availability: 'Global SaaS plan',
      protocols: ['GraphQL', 'REST', 'Webhook', 'SAML'],
      specs: {
        enclosure: 'Cloud service',
        ingress: 'SOC 2 workspace controls',
        operatingRange: '99.9% monthly SLA',
        connectivity: 'API, SSO, webhook exports',
      },
      documents: ['Plan guide', 'SLA exhibit', 'Security overview'],
      metrics: [
        { label: 'Starting at', value: '$18/device' },
        { label: 'Retention', value: '400 days' },
        { label: 'Support', value: '24x7' },
      ],
    },
  ],
  releases: [
    {
      id: 'catalog-2026-q2',
      label: '2026 Q2 catalog',
      summary: 'Adds Observe Pro retention tiers and APAC availability for Edge Gateway X4.',
    },
    {
      id: 'pricebook-2026-q3-draft',
      label: '2026 Q3 price-book draft',
      summary: 'Mock branch state for upcoming regional pricing and bundle changes.',
    },
  ],
};
