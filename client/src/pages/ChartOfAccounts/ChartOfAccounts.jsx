import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getStringSegments, trimText } from '../../utils';
import Tooltip from '../../components/Tooltip';
import AppLayout from '../../components/AppLayout';

const ReusableAccount = ({ b, isSubAccount = false }) => (
  <tr
    key={b?.id}
    onClick={(e) => {
      e.stopPropagation();
    }}
    className={`  hover:bg-[#A0CD850F]  ${isSubAccount ? 'h-12' : 'h-20'}`}
  >
    <td
      className={`px-2  last:pr-5 py-2.5 text-left text-sm ${isSubAccount ? ' first:pl-10' : ' first:pl-5'}`}
    >
      {b?.accountNumber || '-'}
    </td>
    <td
      className={`px-2 first:pl-5 last:pr-5 py-2.5 text-left ${isSubAccount ? 'pl-6' : 'text-sm'}`}
    >
      <div className="flex items-center">
        {b?.institution?.logoUrl && (
          <img
            src={b?.institution?.logoUrl}
            className="w-6 h-6 rounded-full mr-2"
            alt="institute-logo"
          />
        )}
        {b?.name} {b?.mask && <>(...{b?.mask})</>}
      </div>
      {b?.status === 'inactive' && (
        <div className="capitalize  px-1.5 py-0.5 w-fit rounded-md  text-[10px] font-medium text-[#FF4B4B] bg-[#FF4B4B1A]">
          Inactive
        </div>
      )}
    </td>
    <td className="px-2 first:pl-5 last:pr-5 py-2.5 text-left">
      <div
        className={`capitalize  px-2.5 py-1 w-fit rounded-md  font-medium text-sm `}
      >
        {b?.type || '--'}
      </div>
    </td>
    <td className="px-2 first:pl-5 last:pr-5 py-2.5 text-left">
      {b?.subType?.name}
    </td>
    <td className="px-2 first:pl-5 last:pr-5 py-2.5 md:table-cell hidden text-slate-700">
      <div className="flex items-center whitespace-nowrap ">
        {b?.taxes?.length > 0 ? (
          <Tooltip
            tooltipShow={
              `${b?.taxes?.[0]?.name} (${+b?.taxes?.[0]?.percentage}%)`
                ?.length > 20 || b?.taxes?.length > 1
            }
            content={b?.taxes?.map((t, i) => {
              if (`${t?.name} (${+t?.percentage}%)`?.length > 30) {
                const segments = getStringSegments(
                  `${t?.name} (${+t?.percentage}%)`,
                  30,
                );
                return segments.map((segment, index) => (
                  <p
                    key={index}
                    className="text-sm text-center leading-tight"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {segment}{' '}
                    {index === segments?.length - 1 &&
                      b?.taxes?.length - 1 !== i &&
                      ','}
                  </p>
                ));
              }
              return (
                <p
                  key={t?.id}
                  className="text-sm text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {`${t?.name} (${+t?.percentage}%)`}
                  {b?.taxes?.length - 1 !== i && ','}
                </p>
              );
            })}
            contentClassName="border-none rounded-[10px] overflow-visible text-sm text-[#667085] relative"
            position="bottom"
          >
            <span className="">
              {trimText(
                `${b?.taxes?.[0]?.name} (${+b?.taxes?.[0]?.percentage}%)`,
                20,
              )}{' '}
              {b?.taxes?.length > 1 && `+${b?.taxes?.length - 1}`}
            </span>
          </Tooltip>
        ) : (
          'No Taxes'
        )}
      </div>
    </td>

    <td className="px-2 first:pl-5 last:pr-5 py-2.5 text-center">
      {b?.providerBalances?.[b?.providerBalances?.length - 1]
        ?.balanceCurrent !== null &&
      b?.providerBalances?.[b?.providerBalances?.length - 1]?.balanceCurrent !==
        undefined ? (
        <>
          {b?.providerBalances?.[
            b?.providerBalances?.length - 1
          ]?.balanceCurrent
            ?.toString()
            .charAt(0) === '-'
            ? '-'
            : ''}
          $
          {parseFloat(
            b?.providerBalances?.[
              b?.providerBalances?.length - 1
            ]?.balanceCurrent
              ?.toString()
              .replace('-', '') || 0,
          )?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ) : (
        '--'
      )}
    </td>
  </tr>
);

const ChartOfAccounts = () => {
  const [data, setData] = useState([]);

  const getAccounts = async () => {
    const workspaceId = localStorage.getItem('workspaceId');
    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/chart-of-accounts?workspaceId=${workspaceId}`,
      );
      setData(res?.data?.data);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      console.log('error', e);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);
  return (
    <AppLayout>
      <main className="relative grow">
        {/* Content */}
        <div className="px-8 py-8 w-full max-w-9xl mx-auto h-full flex flex-col">
          {/* Page header */}
          <h1 className="text-black text-2xl font-medium leading-[2.375rem] mb-4">
            Chart of Accounts
          </h1>
          {/* Table  */}
          <div className="bg-white  mt-5 dark:bg-slate-800 h-full rounded-sm w-full overflow-auto">
            <table className="table-auto w-full text-black divide-y divide-slate-200 dark:divide-slate-700">
              {/* Table header */}
              <thead className="text-sm text-black">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap flex items-center  cursor-pointer">
                    <div className="font-semibold text-left">
                      Account Number / Code
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap">
                    <div className="flex items-center cursor-pointer">
                      <div className="font-semibold text-left">Name</div>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap flex items-center cursor-pointer">
                    <div className="font-semibold text-left">Type</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap cursor-pointer">
                    <div className="flex items-center">
                      <div className="font-semibold text-left">Sub-Type</div>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap sm:table-cell ">
                    <div className="font-semibold text-left">Taxes</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap sm:table-cell ">
                    <div className="font-semibold text-left">COUNT Balance</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}

              <tbody className="text-sm divide-y text-black divide-slate-200 dark:divide-slate-700">
                {data?.map((b) => (
                  <>
                    <ReusableAccount key={b?.id} b={b} />
                    {b?.subAccounts?.length > 0 &&
                      b?.subAccounts?.map((subAccount) => (
                        <ReusableAccount
                          key={subAccount?.id}
                          b={subAccount}
                          isSubAccount
                          parent={b}
                        />
                      ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default ChartOfAccounts;
