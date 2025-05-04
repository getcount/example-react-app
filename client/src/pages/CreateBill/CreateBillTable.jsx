import React, { forwardRef } from 'react';
import CategoriesDropdown from '../../components/CategoriesDropdown';
import {
  formatNumberGlobally,
  hasUpToTwoDecimalPlaces,
  roundToTwo,
} from '../../utils';

const CreateBillTable = forwardRef(
  (
    {
      billRows,
      setBillRows,
      TABLE_ROW_SCHEMA,
      isLineItemsError = false,
      checkBillRowsError,
      tax,
      setTax,
      discount,
      setDiscount,
      accounts = [],
    },
    ref,
  ) => {
    const handleUpdateValue = (index, field, value) => {
      const tempRows = [...billRows];
      const tempObj = { ...tempRows[index] };
      tempObj[field] = { ...tempObj[field], value };
      if (value) {
        tempObj[field] = { ...tempObj[field], error: false };
      } else if (field !== 'tax') {
        tempObj[field] = { ...tempObj[field], error: true };
      }
      tempRows[index] = tempObj;
      setBillRows(tempRows);
    };

    const calcSubTotal = () => {
      let sum = 0;
      billRows?.forEach((d) => {
        sum +=
          formatNumberGlobally(parseFloat(d.price.value || 0), true) *
          roundToTwo(parseFloat(d.quantity.value || 0));
      });
      return roundToTwo(sum || 0);
    };

    return (
      <div className="col-span-full bg-transparent  w-full rounded-[5px]  my-5 dark:bg-transparent border border-black flex-1 ">
        {/* Table */}
        <div
          className="overflow-x-auto h-full w-full scrollbar"
          id="createBillTableContainer"
        >
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-sm font-semibold text-black border-b border-black bg-[#A0CD850F]">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-medium text-left">Description</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-medium text-left">Account</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-medium text-left">Qty</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap sm:table-cell hidden ">
                  <div className="font-medium text-left">Price (per unit)</div>
                </th>
                <th className="pr-8  pl-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap sm:table-cell hidden ">
                  <div className="font-medium text-right">Amount</div>
                </th>

                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap sm:table-cell hidden " />
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-black ">
              {billRows.map((b, i) => (
                <tr className="" key={i}>
                  <td className="px-2 first:pl-5 last:pr-5 pt-5 pb-[2px] text-left">
                    <div className="h-[60px] flex flex-col">
                      <input
                        type="text"
                        placeholder="Description"
                        value={b.description.value}
                        className={`form-input text-black  ${
                          b.description.error ? '!border-rose-500' : ''
                        }`}
                        onChange={(e) =>
                          handleUpdateValue(i, 'description', e.target.value)
                        }
                        onBlur={
                          b.description.error ? checkBillRowsError : () => {}
                        }
                      />
                      <span className="h-[10px] text-xs mt-1 text-rose-500 ">
                        {b?.description?.error || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 pt-5 pb-[2px] text-left">
                    <div className="h-[60px] flex flex-col">
                      <div className="w-[200px] ">
                        <CategoriesDropdown
                          allCategories={accounts}
                          selectedCategoryId={
                            b?.categoryAccountId?.value || null
                          }
                          setSelectedCategoryId={(value) => {
                            handleUpdateValue(i, 'categoryAccountId', value);
                          }}
                          isSetCategoryStyle
                          id="accountId"
                          name="accUuid"
                          type="expense"
                          isError={b?.categoryAccountId?.error}
                          bottomOfTable
                          onBlur={
                            b?.categoryAccountId?.error
                              ? checkBillRowsError
                              : () => {}
                          }
                          ids={[
                            'billsPageContainer',
                            'createBillTableContainer',
                          ]}
                          placeholderText="Select Account"
                          height={`whitespace-nowrap overflow-hidden h-[38px] ${b?.categoryAccountId?.error ? '!border-rose-500' : ''}   `}
                        />
                      </div>
                      <span className="text-xs mt-1 text-rose-500 h-[10px]">
                        {b?.categoryAccountId?.error || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 pt-5 pb-[2px] text-left">
                    <div className="h-[60px] flex flex-col">
                      <input
                        type="number"
                        value={b.quantity.value}
                        className={`form-input text-black w-32 ${
                          b.quantity.error ? '!border-rose-500' : ''
                        }`}
                        min={0}
                        onChange={(e) =>
                          handleUpdateValue(i, 'quantity', e.target.value)
                        }
                        placeholder="0"
                        step="any"
                        onBlur={
                          b.quantity.value ? checkBillRowsError : () => {}
                        }
                        onWheel={(e) => e.target.blur()}
                      />
                      <span className="text-xs mt-1 text-rose-500 h-[10px]">
                        {b?.quantity?.error || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 pt-5 pb-[2px] text-left">
                    <div className="h-[60px] flex flex-col">
                      <div className="relative">
                        <input
                          type="text"
                          value={b.price.value}
                          className={`form-input text-black w-40 ${
                            b.price.error ? '!border-rose-500' : ''
                          }`}
                          min={0}
                          onChange={(e) =>
                            handleUpdateValue(i, 'price', e.target.value)
                          }
                          placeholder="0.00"
                          step="any"
                          onBlur={b.price.value ? checkBillRowsError : () => {}}
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                      <span className="text-xs mt-1 text-rose-500 h-[10px]">
                        {b?.price?.error || ''}
                      </span>
                    </div>
                  </td>
                  <td className="pr-5 pl-2  first:pl-5 last:pr-5 py-2.5 text-right">
                    <div className="text-right h-[60px] pt-5">
                      <div className="min-w-[4rem] w-fit ml-auto text-black  text-left">
                        {formatNumberGlobally(
                          roundToTwo(
                            parseFloat(b.price.value || 0) *
                              +b.quantity.value || 0,
                          ),
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-2 first:pl-5 last:pr-5 py-2.5 text-center">
                    <div className=" h-[60px] pt-[18px]">
                      <button
                        onClick={() =>
                          setBillRows((prev) =>
                            prev.filter((d, index) => index !== i),
                          )
                        }
                        className="border-[#D0D5DD99] border rounded-[5px] h-[26px] w-[26px] shadow-sm inline-flex justify-center items-center"
                        type="button"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.6059 3.87474C11.4483 3.66093 9.27778 3.55078 7.11373 3.55078C5.83086 3.55078 4.54798 3.61557 3.26511 3.74516L1.94336 3.87474"
                            stroke="#E48642"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.50781 3.22021L5.65035 2.37144C5.75402 1.75592 5.83177 1.2959 6.92675 1.2959H8.62429C9.71927 1.2959 9.8035 1.78184 9.90069 2.37792L10.0432 3.22021"
                            stroke="#E48642"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.2124 5.92188L11.7913 12.4464C11.72 13.4636 11.6617 14.2541 9.85398 14.2541H5.69435C3.88667 14.2541 3.82835 13.4636 3.75708 12.4464L3.33594 5.92188"
                            stroke="#E48642"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.69336 10.6904H8.85092"
                            stroke="#E48642"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.15625 8.09863H9.39583"
                            stroke="#E48642"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6}>
                  <div className="flex  justify-between p-5">
                    <div className="w-full relative">
                      <button
                        type="button"
                        className="btn mb-4 h-9 px-[14px] gap-2 text-indigo-500 text-base border border-indigo-500 cursor-pointer"
                        onClick={() =>
                          setBillRows([
                            ...billRows,
                            {
                              ...JSON.parse(JSON.stringify(TABLE_ROW_SCHEMA)),
                            },
                          ])
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.00004 14.6673C11.6667 14.6673 14.6667 11.6673 14.6667 8.00065C14.6667 4.33398 11.6667 1.33398 8.00004 1.33398C4.33337 1.33398 1.33337 4.33398 1.33337 8.00065C1.33337 11.6673 4.33337 14.6673 8.00004 14.6673Z"
                            stroke="#E48642"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33337 8H10.6667"
                            stroke="#E48642"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 10.6663V5.33301"
                            stroke="#E48642"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Add a line
                      </button>
                      {!billRows?.length > 0 && (
                        <h6 className="left-full sm:left-1/2 whitespace-nowrap -translate-x-full sm:-translate-x-1/2 top-2 absolute text-center">
                          Please Add A New Line
                        </h6>
                      )}
                    </div>
                    {billRows?.length > 0 && (
                      <div className="flex gap-6 justify-end">
                        <div className="flex flex-col gap-3 text-black">
                          <span>Subtotal:</span>
                          <span className="h-[41px] inline-flex items-center">
                            Tax:
                          </span>
                          <span className="h-[41px] inline-flex items-center">
                            Discount:
                          </span>
                          <span className="text-nowrap">Total:</span>
                        </div>
                        <div className="flex flex-col gap-3 text-black font-medium">
                          <span className="min-w-[4rem]">
                            {formatNumberGlobally(calcSubTotal())}
                          </span>
                          <span className="min-w-[4rem]">
                            <div className="relative">
                              <input
                                type="number"
                                value={tax}
                                className="form-input text-black w-40"
                                min={0}
                                onChange={(e) =>
                                  setTax(
                                    e.target.value < 0
                                      ? e.target.value * -1
                                      : e.target.value,
                                  )
                                }
                                placeholder="0.00"
                                step="any"
                                onBlur={
                                  tax
                                    ? () => {
                                        if (
                                          !hasUpToTwoDecimalPlaces(
                                            parseFloat(tax || 0),
                                          ) ||
                                          tax < 0
                                        ) {
                                          setTax(roundToTwo(Math.abs(tax)));
                                        }
                                      }
                                    : () => {}
                                }
                                onWheel={(e) => e.target.blur()}
                              />
                            </div>
                          </span>
                          <span className="min-w-[4rem]">
                            <div className="relative">
                              <input
                                type="number"
                                value={discount}
                                className="form-input text-black w-40"
                                min={0}
                                onChange={(e) =>
                                  setDiscount(
                                    e.target.value < 0
                                      ? e.target.value * -1
                                      : e.target.value,
                                  )
                                }
                                placeholder="0.00"
                                step="any"
                                onBlur={
                                  discount
                                    ? () => {
                                        if (
                                          !hasUpToTwoDecimalPlaces(
                                            parseFloat(discount || 0),
                                          ) ||
                                          discount < 0
                                        ) {
                                          setDiscount(
                                            roundToTwo(Math.abs(discount)),
                                          );
                                        }
                                      }
                                    : () => {}
                                }
                                onWheel={(e) => e.target.blur()}
                              />
                            </div>
                          </span>
                          <span className="min-w-[4rem]">
                            {formatNumberGlobally(
                              roundToTwo(
                                roundToTwo(parseFloat(tax || 0)) +
                                  roundToTwo(parseFloat(calcSubTotal())) -
                                  roundToTwo(parseFloat(discount || 0)),
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {isLineItemsError && (
            <p className="text-rose-500 text-center font-semibold mb-4">
              {isLineItemsError
                ? billRows.length === 0
                  ? 'At least one Line Item is required.'
                  : typeof isLineItemsError === 'boolean'
                    ? 'Please Fill Line Items Properly'
                    : isLineItemsError || ''
                : ''}
            </p>
          )}
        </div>
      </div>
    );
  },
);

CreateBillTable.displayName = 'CreateBillTable';

export default CreateBillTable;
