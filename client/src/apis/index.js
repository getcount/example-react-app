import { toast } from 'react-toastify';
import AxiosInstance from './axiosIntance';
import * as url from './urlHelper';

export const signInApi = async (data) => {
  try {
    const response = await AxiosInstance.post(`${url.SIGN_IN}`, data);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await AxiosInstance.get(`${url.USER_DETAILS}`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getScheduleProcedures = async ({
  date = '',
  tester = '',
} = {}) => {
  try {
    const response = await AxiosInstance.get(
      `${url.SCHEDULE_PROCEDURES}?scheduled_end_date__gte=${date}T00:00:00Z&tester=${tester}&scheduled_start_date__lte=${date}T23:59:00Z`,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const startTestProcedure = async ({ id = null, data = {} } = {}) => {
  try {
    const response = await AxiosInstance.patch(
      `${url.SCHEDULE_PROCEDURES}/${id}/`,
      data,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getProjects = async () => {
  try {
    const response = await AxiosInstance.get(`${url.PROJECTS}`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getVehicleModels = async () => {
  try {
    const response = await AxiosInstance.get(`${url.VEHICLE_MODEL}`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getVehicles = async () => {
  try {
    const response = await AxiosInstance.get(`${url.VEHICLE}`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await AxiosInstance.get(`${url.USER}`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const updateUserById = async (id, data) => {
  try {
    const response = await AxiosInstance.patch(`${url.USER}/${id}/`, data);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getTicketsIssues = async ({
  model = '',
  vehicle = '',
  category = '',
  reporter = '',
  raisedAfter = '',
  raisedBefore = '',
  summary = '',
  customer = '',
  ids = [],
  search = '',
  page = 1,
  all = '',
} = {}) => {
  try {
    const response = await AxiosInstance.get(
      `${url.TICKETS_ISSUE}?all=${all}&test_case_executions__test_procedure_execution__vehicle__model=${model}&test_case_executions__test_procedure_execution__vehicle=${vehicle}&category=${category}&reporter=${reporter}&created_at__gt=${raisedAfter}&created_at__lt=${raisedBefore}&summary=${summary}&customer=${customer}&id__in=${ids}&search=${search}&page=${page}`,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getTicketIssueById = async ({ id = '' } = {}) => {
  try {
    const response = await AxiosInstance.get(`${url.TICKETS_ISSUE}${id}/`);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const createTicketsIssues = async ({ data = {} } = {}) => {
  try {
    const response = await AxiosInstance.post(`${url.TICKETS_ISSUE}`, data);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const updateTicketIssue = async ({ id, data = {} } = {}) => {
  try {
    const response = await AxiosInstance.patch(
      `${url.TICKETS_ISSUE}${id}/`,
      data,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getAllTestProcedures = async ({ id = '' } = {}) => {
  try {
    const response = await AxiosInstance.get(
      `${url.TEST_PROCEDURE_EXECUTION}${id}/full/`,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const updateTestProcedure = async ({ id = '', data = {} } = {}) => {
  try {
    const response = await AxiosInstance.patch(
      `${url.TEST_PROCEDURE_EXECUTION}${id}/`,
      data,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const updateTestCaseExecution = async ({ id = '', data = {} } = {}) => {
  try {
    const response = await AxiosInstance.patch(
      `${url.TEST_CASE_EXECUTION}${id}/`,
      data,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const uploadTicketAttachment = async (data) => {
  try {
    const response = await AxiosInstance.post(
      `${url.TICKETS_ATTACHMENT}`,
      data,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const deleteTicketAttachment = async (id) => {
  try {
    const response = await AxiosInstance.delete(
      `${url.TICKETS_ATTACHMENT}${id}/`,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};

export const getTicketAttachments = async (id) => {
  try {
    const response = await AxiosInstance.get(
      `${url.TICKETS_ATTACHMENT}/by-issue/${id}/`,
    );
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error?.response?.data?.message;
  }
};
