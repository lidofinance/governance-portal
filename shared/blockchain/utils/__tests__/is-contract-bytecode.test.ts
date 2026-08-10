import { isContractBytecode } from 'shared/blockchain/utils/is-contract-bytecode';

describe('isContractBytecode', () => {
  test('should treat empty bytecode as not a contract', () => {
    expect(isContractBytecode('0x')).toBe(false);
  });

  test('should treat missing bytecode as not a contract', () => {
    expect(isContractBytecode(undefined)).toBe(false);
  });

  test('should treat deployed bytecode as a contract', () => {
    expect(isContractBytecode('0x6080604052348015600f57600080fd5b50')).toBe(
      true,
    );
  });

  test('should treat an EIP-7702 delegated EOA as not a contract', () => {
    expect(
      isContractBytecode('0xef0100b15bed8fc30d3e82672bf7cd75417b414983934b'),
    ).toBe(false);
  });

  test('should treat an uppercase EIP-7702 designator as not a contract', () => {
    expect(
      isContractBytecode('0xEF0100B15BED8FC30D3E82672BF7CD75417B414983934B'),
    ).toBe(false);
  });

  test('should match the delegation designator by prefix only', () => {
    expect(isContractBytecode('0x60806040ef0100b15bed8fc30d3e82672bf7')).toBe(
      true,
    );
  });
});
