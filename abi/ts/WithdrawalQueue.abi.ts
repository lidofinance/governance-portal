export const withdrawalQueueAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "stEth",
        type: "address"
      },
      {
        internalType: "address payable",
        name: "refundAddress",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  {
    inputs: [],
    name: "ApprovalToOwner",
    type: "error"
  },
  {
    inputs: [],
    name: "ApproveToCaller",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_firstArrayLength",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_secondArrayLength",
        type: "uint256"
      }
    ],
    name: "ArraysLengthMismatch",
    type: "error"
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_hint",
        type: "uint256"
      }
    ],
    name: "InvalidHint",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "InvalidRequestId",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "startId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "endId",
        type: "uint256"
      }
    ],
    name: "InvalidRequestIdRange",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address"
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      }
    ],
    name: "NotOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "NotOwnerOrApproved",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "NotOwnerOrApprovedForAll",
    type: "error"
  },
  {
    inputs: [],
    name: "PausedExpected",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "RequestAlreadyClaimed",
    type: "error"
  },
  {
    inputs: [],
    name: "RequestIdsNotSorted",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "RequestNotFoundOrNotFinalized",
    type: "error"
  },
  {
    inputs: [],
    name: "ResumedExpected",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferToThemselves",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "MAX_STETH_WITHDRAWAL_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MIN_STETH_WITHDRAWAL_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "PAUSE_INFINITELY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "ST_ETH",
    outputs: [
      {
        internalType: "contract IStETH",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_requestIds",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_hints",
        type: "uint256[]"
      }
    ],
    name: "claimWithdrawals",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lastRequestIdToBeFinalized",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_maxShareRate",
        type: "uint256"
      }
    ],
    name: "finalize",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_requestIds",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "_firstIndex",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_lastIndex",
        type: "uint256"
      }
    ],
    name: "findCheckpointHints",
    outputs: [
      {
        internalType: "uint256[]",
        name: "hintIds",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_requestIds",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_hints",
        type: "uint256[]"
      }
    ],
    name: "getClaimableEther",
    outputs: [
      {
        internalType: "uint256[]",
        name: "claimableEthValues",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLastCheckpointIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLastFinalizedRequestId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLastRequestId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getResumeSinceTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_requestIds",
        type: "uint256[]"
      }
    ],
    name: "getWithdrawalStatus",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amountOfStETH",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amountOfShares",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256"
          },
          {
            internalType: "bool",
            name: "isFinalized",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "isClaimed",
            type: "bool"
          }
        ],
        internalType: "struct IWithdrawalQueue.WithdrawalRequestStatus[]",
        name: "statuses",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_requestIds",
        type: "uint256[]"
      }
    ],
    name: "markClaimed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256"
      }
    ],
    name: "pauseFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOfETH",
        type: "uint256"
      }
    ],
    name: "refundEth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      }
    ],
    name: "requestWithdrawals",
    outputs: [
      {
        internalType: "uint256[]",
        name: "requestIds",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "resume",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
