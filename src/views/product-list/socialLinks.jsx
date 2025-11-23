import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Modal,
  ModalBody,
} from "@/base-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SOCIAL_LINKS } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { LoadingIcon } from "../../base-components";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useDelete from "../../hooks/useDelete";

function SocialLinks() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState([]);
  const navigate = useNavigate();
  const { deleteData } = useDelete();

  const getSocialLinks = async () => {
    try {
      setLoading(false);
      setSocialLinks([
        {
          _id: "1",
          name: "Facebook",
          link: "https://www.facebook.com",
        },
        {
          _id: "2",
          name: "Twitter",
          link: "https://www.twitter.com",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSocialLinks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`${SOCIAL_LINKS}/${id}`);
      toast.success("Link deleted successfully");
      setDeleteConfirmationModal(false);
      getSocialLinks();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }} // Adjust the size as needed
        />
      </div>
    );
  }

  return (
    <>
      {/* <h2 className="intro-y text-lg font-medium mt-10">Clubs List</h2> */}
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Manage social links</p>
          </div>
          <div>
            <Link to={"/add-socialLinks"}>
              <button className="btn btn-primary shadow-md mr-2">
                Add Social links
              </button>
            </Link>
          </div>
        </div>

        {/* BEGIN: Data List */}
        {socialLinks.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Platform</th>
                  <th className=" text-center whitespace-nowrap">Link</th>
                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {socialLinks?.map((link, index) => (
                  <tr key={index} className="intro-x">
                    <td className="w-40">
                      <div className="flex">
                        <div className="font-medium whitespace-nowrap">
                          {link.name}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      {link.link ? (
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {(() => {
                            try {
                              return new URL(link.link).hostname;
                            } catch {
                              return "Invalid URL";
                            }
                          })()}
                        </a>
                      ) : (
                        <span>No Link</span>
                      )}
                    </td>

                    <td className=" w-56">
                      <div className="flex justify-center items-center ">
                        <div
                          onClick={() =>
                            navigate("/add-socialLinks", {
                              state: { data: link },
                            })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                          {/* Edit */}
                        </div>
                        <a
                          className="flex items-center text-danger"
                          href="#"
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setId(link._id);
                          }}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                          {/* Delete */}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="intro-y col-span-12 flex justify-center items-center">
            No data found.
          </div>
        )}
        {/* END: Data List */}
      </div>

      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this record? This process cannot be
              undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(id)}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default SocialLinks;
