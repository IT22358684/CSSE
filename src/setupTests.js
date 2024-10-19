import '@testing-library/jest-dom'; // For extended matchers
import { TextEncoder, TextDecoder } from 'text-encoding';
import { ReadableStream } from 'stream/web'; // Use Node.js-native ReadableStream

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
