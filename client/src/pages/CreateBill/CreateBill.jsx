import React, { useEffect, useMemo, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Axios from 'axios';
import { toast } from 'react-toastify';
import {
  formatNumberGlobally,
  hasUpToTwoDecimalPlaces,
  roundToTwo,
  transformAccounts,
} from '../../utils';
import Currencies from '../data/Currencies.json';
import CreateBillTable from './CreateBillTable';
import AppLayout from '../../components/AppLayout';
import TextInput from '../../components/TextInput';
import Dropdown from '../../components/Dropdown';

const TABLE_ROW_SCHEMA = {
  description: { value: '', error: false },
  categoryAccountId: { value: null, error: false },
  quantity: { value: '', error: false },
  price: { value: '', error: false },
  tax: { value: '', error: false },
  customerId: { value: null, error: false },
  projectId: { value: null, error: false },
  tags: { value: [], error: false },
};

const CreateBill = () => {
  const [loading, setLoading] = useState(false);

  const [billRows, setBillRows] = useState([
    JSON.parse(JSON.stringify(TABLE_ROW_SCHEMA)),
  ]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const checkBillRowsError = () => {
    let isError = false;
    if (billRows?.length === 0) {
      return true;
    }
    const tempRows = [...billRows];
    billRows.forEach((d, i) => {
      Object.keys(d || {}).forEach((key) => {
        const tempRow = { ...billRows[i] };
        if (
          d[key].value !== 0 &&
          !d[key].value &&
          key !== 'tax' &&
          key !== 'description' &&
          key !== 'quantity' &&
          key !== 'price' &&
          key !== 'customerId' &&
          key !== 'projectId' &&
          key !== 'tags' &&
          key !== 'id'
        ) {
          tempRow[key].error = true;
          isError = true;
        }
        if (key === 'price') {
          if (d[key].value && Number.isNaN(Number(d[key].value))) {
            tempRow[key].error = 'Value must be a valid number.';
            isError = true;
          }
        }
        if (key === 'quantity' || key === 'total') {
          if (!hasUpToTwoDecimalPlaces(parseFloat(tempRow[key].value))) {
            tempRow[key].value = roundToTwo(d[key].value);
          }
        }

        if (key === 'categoryAccountId' && !d[key].value) {
          tempRow[key].error = 'Category should not be empty';
          isError = true;
        }
        if (key === 'description' && d[key].value?.trim()?.length === 0) {
          tempRow[key].error = 'Description should not be empty';
          isError = true;
        }
        if (key === 'description' && d[key].value?.length > 300) {
          tempRow[key].error = 'Description must be 300 characters or less';
          isError = true;
        }
      });
    });
    setBillRows(tempRows);
    return isError;
  };

  const [AllAccountsData, setAllAccountsData] = useState([]);
  const [vendors, setVendors] = useState([]);

  const getAccounts = async () => {
    const workspaceId = localStorage.getItem('workspaceId');
    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/chart-of-accounts?workspaceId=${workspaceId}`,
      );
      setAllAccountsData(res?.data?.data);
    } catch (e) {
      console.log('error', e);
    }
  };

  const getVendors = async () => {
    const workspaceId = localStorage.getItem('workspaceId');
    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/vendors?workspaceId=${workspaceId}`,
      );

      setVendors(res?.data?.data?.vendors);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    getAccounts();
    getVendors();
  }, []);

  const accounts = useMemo(
    () =>
      transformAccounts(
        AllAccountsData,
        'CATEGORY_PHYSICAL_ACCOUNT',
        'expense',
      ),
    [AllAccountsData],
  );

  const handleSubmit = async (values, formikHandler) => {
    if (checkBillRowsError()) {
      return;
    }
    const lineItems = billRows.map((d) => {
      const temp = {
        description: d?.description?.value,
        categoryAccountUuid: d?.categoryAccountId?.value,
        quantity: roundToTwo(parseFloat(d?.quantity?.value || 0)),
        price: formatNumberGlobally(parseFloat(d?.price?.value || 0), true),
        tax: roundToTwo(parseFloat(d?.tax?.value)),
        customerId: d?.customerId?.value || null,
        projectId: d?.projectId?.value || null,
        tags: d?.tags?.value,
      };
      return temp;
    });

    setLoading(true);

    try {
      const {
        vendorUuid,
        notes,
        recurring,
        firstDueDate,
        billNumber,
        purchaseOrderNumber,
        firstBillDate,
        currency,
        approvalStatus,
      } = values;
      const data = {
        vendorUuid,
        notes,
        recurring,
        firstDueDate,
        billNumber,
        purchaseOrderNumber,
        lineItems,
        currency,
        tax: roundToTwo(tax || 0),
        discount: roundToTwo(discount || 0),
        approvalStatus,
      };
      data.firstDueDate = firstDueDate;
      data.firstBillDate = firstBillDate;
      data.recurring = false;

      const workspaceId = localStorage.getItem('workspaceId');
      const res = await Axios.post(
        `${process.env.REACT_APP_BASE_URL_API}/bills?workspaceId=${workspaceId}`,
        data,
      );
      if (res?.data?.data?.id) {
        toast.success('Bill Created Successfully');

        setBillRows([JSON.parse(JSON.stringify(TABLE_ROW_SCHEMA))]);
        formikHandler.resetForm();
        setTax(0);
        setDiscount(0);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout pageId="billsPageContainer">
      <main className="relative grow">
        {/* Content */}
        <div className="px-8 py-8 w-full max-w-9xl mx-auto h-full flex flex-col">
          {/* Page header */}
          <h1 className="text-black text-2xl font-medium leading-[2.375rem] mb-4">
            Create Bill
          </h1>

          <Formik
            initialValues={{
              vendorUuid: null,
              firstBillDate: moment().format('YYYY-MM-DD'),
              firstDueDate: moment().format('YYYY-MM-DD'),
              billNumber: '',
              purchaseOrderNumber: '',
              notes: '',
              currency: 'USD',
            }}
            validationSchema={Yup.object({
              vendorUuid: Yup.string().required('Please Select Vendor'),
              firstBillDate: Yup.string().required('Please  Select Bill Date'),
              firstDueDate: Yup.string().required(
                'Please  Select Bill Due Date',
              ),
              billNumber: Yup.string(),
              purchaseOrderNumber: Yup.string(),
              currency: Yup.string().required('Please Select Currency'),
            })}
            onSubmit={handleSubmit}
          >
            {(validation) => (
              <Form>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Dropdown
                    label="Vendor"
                    required
                    options={vendors}
                    placeholder="Select Vendor"
                    selected={validation.values.vendorUuid}
                    setSelected={(value) => {
                      validation.setFieldValue('vendorUuid', value);
                    }}
                    idKey="uuid"
                    id="vendorUuid"
                    name="name"
                    error={
                      validation.touched.vendorUuid &&
                      validation.errors.vendorUuid
                    }
                  />
                  <TextInput
                    label="Bill Date"
                    required
                    id="firstBillDate"
                    type="date"
                    name="firstBillDate"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstBillDate || ''}
                    error={
                      validation.touched.firstBillDate &&
                      validation.errors.firstBillDate
                    }
                  />
                  <TextInput
                    label="Bill Due Date"
                    required
                    id="firstDueDate"
                    type="date"
                    name="firstDueDate"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstDueDate || ''}
                    error={
                      validation.touched.firstDueDate &&
                      validation.errors.firstDueDate
                    }
                  />
                  <TextInput
                    label="Bill Number"
                    id="billNumber"
                    placeholder="Bill Number"
                    name="billNumber"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.billNumber || ''}
                    error={
                      validation.touched.billNumber &&
                      validation.errors.billNumber
                    }
                  />

                  <TextInput
                    label="Purchase Order Number"
                    id="purchaseOrderNumber"
                    placeholder="Purchase Order Number"
                    name="purchaseOrderNumber"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.purchaseOrderNumber || ''}
                    error={
                      validation.touched.purchaseOrderNumber &&
                      validation.errors.purchaseOrderNumber
                    }
                  />
                  <Dropdown
                    label="Currency"
                    required
                    options={Currencies?.map((currency) => ({
                      id: currency?.isoCode,
                      name: `${currency?.symbol} ${currency?.name}`,
                    }))}
                    placeholder="Select Type"
                    selected={validation.values.currency}
                    setSelected={(value) => {
                      validation.setFieldValue('currency', value);
                    }}
                    id="currency"
                    name="name"
                  />
                  <TextInput
                    label="Memo"
                    id="notes"
                    type="textarea"
                    placeholder="Enter Memo"
                    name="notes"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.notes || ''}
                    error={validation.touched.notes && validation.errors.notes}
                    width="col-span-full"
                  />

                  <CreateBillTable
                    billRows={billRows}
                    setBillRows={setBillRows}
                    TABLE_ROW_SCHEMA={TABLE_ROW_SCHEMA}
                    isLineItemsError={false}
                    checkBillRowsError={checkBillRowsError}
                    tax={tax}
                    setTax={setTax}
                    discount={discount}
                    setDiscount={setDiscount}
                    accounts={accounts}
                  />
                </div>
                {/* Modal footer */}

                <div className="flex justify-end mt-4 ">
                  <button
                    type="submit"
                    className="h-11 w-fit py-2.5 px-4 min-w-20 flex items-center justify-center rounded-[5px] bg-indigo-500 text-white font-normal text-base leading-6 shadow-sm
               disabled:bg-indigo-400    disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        className="animate-spin w-4 h-4 fill-current shrink-0 mr-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    )}
                    Add
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </AppLayout>
  );
};

export default CreateBill;
