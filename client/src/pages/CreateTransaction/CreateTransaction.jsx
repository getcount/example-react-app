import React, { useEffect, useMemo, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { newTransformAccounts, transformAccounts } from '../../utils';
import Dropdown from '../../components/Dropdown';
import CategoriesDropdown from '../../components/CategoriesDropdown';
import TextInput from '../../components/TextInput';
import AppLayout from '../../components/AppLayout';
import Currencies from '../data/Currencies.json';

const CreateTransaction = () => {
  const [loading, setLoading] = useState(false);

  const [AllAccountsData, setAllAccountsData] = useState([]);

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

  const accounts = useMemo(
    () => transformAccounts(AllAccountsData, 'PHYSICAL_ACCOUNT'),
    [AllAccountsData],
  );

  useEffect(() => {
    getAccounts();
  }, []);

  const incomeCategories = useMemo(
    () =>
      newTransformAccounts(
        AllAccountsData,
        'CATEGORY_PHYSICAL_ACCOUNT',
        'income',
      ),
    [AllAccountsData],
  );
  const expenseCategories = useMemo(
    () =>
      newTransformAccounts(
        AllAccountsData,
        'CATEGORY_PHYSICAL_ACCOUNT',
        'expense',
      ),
    [AllAccountsData],
  );

  const handleSubmit = async (values, formikHandler) => {
    setLoading(true);
    try {
      const workspaceId = localStorage.getItem('workspaceId');

      const res = await Axios.post(
        `${process.env.REACT_APP_BASE_URL_API}/transactions?workspaceId=${workspaceId}`,
        values,
      );
      toast.success('Transaction created successfully');
      formikHandler?.resetForm();
      setLoading(false);
    } catch (e) {
      console.log('error', e?.response?.data?.message);
      toast.error(e?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="relative grow">
        {/* Content */}
        <div className="px-8 py-8 w-full max-w-9xl mx-auto h-full flex flex-col">
          {/* Page header */}
          <h1 className="text-black text-2xl font-medium leading-[2.375rem] mb-4">
            Create Transaction
          </h1>

          <Formik
            initialValues={{
              accUuid: null,
              vendorId: null,
              name: '',
              categoryAccountUuid: null,
              amount: '',
              postedDate: moment().format('YYYY-MM-DD'),
              notes: '',
              type: 'Income',
              currency: 'USD',
              description: '',
              taxes: '',
              tags: [],
            }}
            validationSchema={Yup.object({
              accUuid: Yup.string().required('Please Select Account'),
              name: Yup.string(),
              vendorId: undefined,
              categoryAccountUuid: Yup.string().required(
                'Please Select Category',
              ),
              amount: Yup.string()
                .required('Please Enter Amount')
                .test(
                  'is-valid-number',
                  'Amount must be a valid number',
                  (value) => {
                    if (!value) return false; // catches empty string
                    const num = Number(value);
                    return (
                      typeof num === 'number' &&
                      !Number.isNaN(num) &&
                      Number.isFinite(num)
                    );
                  },
                ),
              postedDate: Yup.string().required('Please Enter Payment Date'),
              currency: Yup.string(),
              description: Yup.string().required('Please Enter Description'),
            })}
            onSubmit={handleSubmit}
          >
            {(validation) => (
              <Form>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <TextInput
                    label="Description"
                    required
                    id="description"
                    placeholder="Description"
                    name="description"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ''}
                    error={
                      validation.touched.description &&
                      validation.errors.description
                    }
                  />
                  <Dropdown
                    label="Type"
                    required
                    options={[
                      {
                        id: 'Income',
                        name: 'Income',
                      },
                      {
                        id: 'Expense',
                        name: 'Expense',
                      },
                    ]}
                    placeholder="Select Type"
                    selected={validation.values.type}
                    setSelected={(value) => {
                      if (value !== validation.values.type) {
                        validation.setFieldValue('categoryAccountUuid', null);
                      }
                      validation.setFieldValue('type', value);
                    }}
                    id="type"
                    name="name"
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
                  <CategoriesDropdown
                    label="Account"
                    required
                    allCategories={accounts}
                    selectedCategoryId={validation.values.accUuid}
                    setSelectedCategoryId={(_, account) => {
                      validation.setFieldValue('accUuid', account?.accUuid);
                      if (account?.taxes?.[0]?.id) {
                        validation.setFieldValue(
                          'taxes',
                          account?.taxes?.[0]?.id,
                        );
                      } else {
                        validation.setFieldValue('taxes', '');
                      }
                    }}
                    isSetCategoryStyle
                    id="accUuid"
                    name="accUuid"
                    type="account"
                    error={
                      validation.touched.accUuid && validation.errors.accUuid
                    }
                    placeholderText="Select Account"
                  />
                  <TextInput
                    label="Amount"
                    required
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    name="amount"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.amount || ''}
                    error={
                      validation.touched.amount && validation.errors.amount
                    }
                  />
                  <TextInput
                    label="Date"
                    required
                    id="postedDate"
                    type="date"
                    name="postedDate"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.postedDate || ''}
                    error={
                      validation.touched.postedDate &&
                      validation.errors.postedDate
                    }
                  />
                  <CategoriesDropdown
                    label="Category"
                    required
                    allCategories={
                      validation.values.type === 'expense'
                        ? expenseCategories
                        : incomeCategories
                    }
                    selectedCategoryId={validation.values.categoryAccountUuid}
                    setSelectedCategoryId={(_, account) => {
                      validation.setFieldValue(
                        'categoryAccountUuid',
                        account?.accUuid,
                      );
                    }}
                    isSetCategoryStyle
                    id="categoryAccountUuid"
                    name="accUuid"
                    error={
                      validation.touched.categoryAccountUuid &&
                      validation.errors.categoryAccountUuid
                    }
                    placeholderText="Select Category"
                  />
                  <TextInput
                    label="Note"
                    id="notes"
                    type="textarea"
                    placeholder="Enter Notes"
                    name="notes"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.notes || ''}
                    error={validation.touched.notes && validation.errors.notes}
                    width="col-span-full"
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

export default CreateTransaction;
