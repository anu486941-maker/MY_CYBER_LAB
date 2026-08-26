import { SubnetQuestion } from '../types';

export const PRESET_SUBNET_QUESTIONS: SubnetQuestion[] = [
  {
    id: 'sub-1',
    ipAddress: '192.168.1.10',
    cidr: 24,
    subnetMask: '255.255.255.0',
    networkAddress: '192.168.1.0',
    broadcastAddress: '192.168.1.255',
    firstUsableHost: '192.168.1.1',
    lastUsableHost: '192.168.1.254',
    totalUsableHosts: 254,
    binaryMask: '11111111.11111111.11111111.00000000',
    binaryIp: '11000000.10101000.00000001.00001010'
  },
  {
    id: 'sub-2',
    ipAddress: '10.0.5.88',
    cidr: 26,
    subnetMask: '255.255.255.192',
    networkAddress: '10.0.5.64',
    broadcastAddress: '10.0.5.127',
    firstUsableHost: '10.0.5.65',
    lastUsableHost: '10.0.5.126',
    totalUsableHosts: 62,
    binaryMask: '11111111.11111111.11111111.11000000',
    binaryIp: '00001010.00000000.00000101.01011000'
  },
  {
    id: 'sub-3',
    ipAddress: '172.16.42.100',
    cidr: 27,
    subnetMask: '255.255.255.224',
    networkAddress: '172.16.42.96',
    broadcastAddress: '172.16.42.127',
    firstUsableHost: '172.16.42.97',
    lastUsableHost: '172.16.42.126',
    totalUsableHosts: 30,
    binaryMask: '11111111.11111111.11111111.11100000',
    binaryIp: '10101100.00010000.00101010.01100100'
  },
  {
    id: 'sub-4',
    ipAddress: '192.168.10.45',
    cidr: 28,
    subnetMask: '255.255.255.240',
    networkAddress: '192.168.10.32',
    broadcastAddress: '192.168.10.47',
    firstUsableHost: '192.168.10.33',
    lastUsableHost: '192.168.10.46',
    totalUsableHosts: 14,
    binaryMask: '11111111.11111111.11111111.11110000',
    binaryIp: '11000000.10101000.00001010.00101101'
  },
  {
    id: 'sub-5',
    ipAddress: '10.10.20.14',
    cidr: 29,
    subnetMask: '255.255.255.248',
    networkAddress: '10.10.20.8',
    broadcastAddress: '10.10.20.15',
    firstUsableHost: '10.10.20.9',
    lastUsableHost: '10.10.20.14',
    totalUsableHosts: 6,
    binaryMask: '11111111.11111111.11111111.11111000',
    binaryIp: '00001010.00001010.00010100.00001110'
  },
  {
    id: 'sub-6',
    ipAddress: '192.168.100.2',
    cidr: 30,
    subnetMask: '255.255.255.252',
    networkAddress: '192.168.100.0',
    broadcastAddress: '192.168.100.3',
    firstUsableHost: '192.168.100.1',
    lastUsableHost: '192.168.100.2',
    totalUsableHosts: 2,
    binaryMask: '11111111.11111111.11111111.11111100',
    binaryIp: '11000000.10101000.01100100.00000010'
  }
];

export function generateRandomSubnetQuestion(): SubnetQuestion {
  const cidrList = [24, 25, 26, 27, 28, 29, 30];
  const cidr = cidrList[Math.floor(Math.random() * cidrList.length)];
  
  const octet1 = Math.random() > 0.5 ? 192 : (Math.random() > 0.5 ? 10 : 172);
  const octet2 = octet1 === 192 ? 168 : (octet1 === 172 ? 16 : Math.floor(Math.random() * 10));
  const octet3 = Math.floor(Math.random() * 254) + 1;
  
  const hostBits = 32 - cidr;
  const blockSize = Math.pow(2, hostBits);
  const numBlocks = 256 / blockSize;
  const randomBlock = Math.floor(Math.random() * numBlocks);
  const netOctet4 = randomBlock * blockSize;
  const broadOctet4 = netOctet4 + blockSize - 1;
  const randomOffset = Math.floor(Math.random() * (blockSize - 2)) + 1;
  const octet4 = netOctet4 + (blockSize > 2 ? randomOffset : 1);
  
  const ipAddress = `${octet1}.${octet2}.${octet3}.${octet4}`;
  const networkAddress = `${octet1}.${octet2}.${octet3}.${netOctet4}`;
  const broadcastAddress = `${octet1}.${octet2}.${octet3}.${broadOctet4}`;
  const firstUsableHost = `${octet1}.${octet2}.${octet3}.${netOctet4 + 1}`;
  const lastUsableHost = `${octet1}.${octet2}.${octet3}.${broadOctet4 - 1}`;
  const totalUsableHosts = Math.max(2, Math.pow(2, hostBits) - 2);
  
  const lastOctetMask = 256 - blockSize;
  const subnetMask = `255.255.255.${lastOctetMask}`;
  
  const toBin8 = (n: number) => n.toString(2).padStart(8, '0');
  const binaryIp = `${toBin8(octet1)}.${toBin8(octet2)}.${toBin8(octet3)}.${toBin8(octet4)}`;
  const binaryMask = `${toBin8(255)}.${toBin8(255)}.${toBin8(255)}.${toBin8(lastOctetMask)}`;

  return {
    id: `dyn-sub-${Date.now()}`,
    ipAddress,
    cidr,
    subnetMask,
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    totalUsableHosts,
    binaryMask,
    binaryIp
  };
}
