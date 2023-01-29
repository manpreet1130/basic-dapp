// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract MyContract {
    uint256 public data;

    constructor(uint256 _data) {
        data = _data;
    }

    function setData(uint256 _data) public {
        data = _data;
    }

    function getData() public view returns(uint256) {
        return data;
    }
}