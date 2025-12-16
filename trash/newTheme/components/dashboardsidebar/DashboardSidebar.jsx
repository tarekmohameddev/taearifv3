/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { usePathname } from "next/navigation";
import { FaNoteSticky } from "react-icons/fa6";
import {
  FaPlus,
  FaList,
  FaTicketAlt,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
const DropdownMenu_users = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-900 hover:text-purple-550 w-full text-md"
      >
        <FaUsers className="mr-2" /> {title}
        <span className="ml-auto text-[18px]">
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="text-gray-900 hover:text-purple-550 ml-4 flex items-center text-sm"
              >
                {" "}
                {item.icon && <item.icon className="mr-2 text-xs" />}{" "}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const DropdownMenu_coupons = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-900 hover:text-purple-550 w-full text-md"
      >
        <FaTicketAlt className="mr-2" /> {title}
        <span className="ml-auto text-[18px]">
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="text-gray-900 hover:text-purple-550 ml-4 flex items-center text-sm"
              >
                {" "}
                {item.icon && <item.icon className="mr-2 text-xs" />}{" "}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const DropdownMenu_jobs = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-900 hover:text-purple-550 w-full text-md"
      >
        <MdWork className="mr-2" /> {title}
        <span className="ml-auto text-[18px]">
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="text-gray-900 hover:text-purple-550 ml-4 flex items-center text-sm"
              >
                {" "}
                {item.icon && <item.icon className="mr-2 text-xs" />}{" "}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const DropdownMenu_Products = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-900 hover:text-purple-550 w-full text-md"
      >
        <AiFillProduct className="mr-2 text-lg" /> {title}
        <span className="ml-auto text-[18px]">
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="text-gray-900 hover:text-purple-550 ml-4 flex items-center text-sm"
              >
                {" "}
                {item.icon && <item.icon className="mr-2 text-sm" />}{" "}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const DashboardSidebar = ({ isMenuOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setLastScrollPos(currentScrollPos);
      setIsScrolled(window.scrollY > 10);
    };

    const checkScreenSize = () => {
      setIsLgScreen(window.innerWidth >= 1024); // lg screen size (1024px or higher)
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);

    checkScreenSize(); // Initial check on page load

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [lastScrollPos]);
  const handleAddProduct = async (previousValues = {}) => {
    let imageFile = null;

    const { value: formValues } = await Swal.fire({
      title: "Add New Product",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${
          previousValues.name || ""
        }">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Price" value="${
          previousValues.price || ""
        }">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Category" value="${
          previousValues.category || ""
        }">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Image URL" value="${
          previousValues.image || ""
        }">` +
        `<input id="swal-input6" type="file" accept="image/*" style="display: none;">` +
        `<button id="upload-button" class="swal2-confirm swal2-styled" style="display: inline-block; margin-top: 10px;">Upload Image</button>` +
        `<div id="image-preview" style="margin-top: 10px;"></div>` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${
          previousValues.description || ""
        }</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
      didOpen: () => {
        const uploadButton = document.getElementById("upload-button");
        const fileInput = document.getElementById("swal-input6");
        const imageUrlInput = document.getElementById("swal-input5");
        const imagePreview = document.getElementById("image-preview");

        uploadButton.addEventListener("click", () => {
          fileInput.click();
        });

        fileInput.addEventListener("change", (event) => {
          imageFile = event.target.files[0];
          if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">`;
              imageUrlInput.value = "";
            };
            reader.readAsDataURL(imageFile);
          }
        });

        imageUrlInput.addEventListener("input", () => {
          if (imageUrlInput.value) {
            imagePreview.innerHTML = `<img src="${imageUrlInput.value}" style="max-width: 100%; max-height: 200px;">`;
            imageFile = null;
          } else {
            imagePreview.innerHTML = "";
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const description = document.getElementById("swal-input2").value;
        const price = document.getElementById("swal-input3").value;
        const category = document.getElementById("swal-input4").value;
        const imageUrl = document.getElementById("swal-input5").value;

        if (!name || !price || !category || (!imageUrl && !imageFile)) {
          Swal.showValidationMessage(
            "Please fill in all fields and provide an image",
          );
          return false;
        }

        return {
          name,
          price,
          category,
          image: imageUrl || "file_upload",
          description,
        };
      },
    });

    if (formValues) {
      try {
        const formData = new FormData();
        Object.keys(formValues).forEach((key) => {
          if (key === "tags") {
            formData.append(key, JSON.stringify(formValues[key]));
          } else {
            formData.append(key, formValues[key]);
          }
        });

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        const res = await fetch("/api/product/addProduct", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to add product");
        }

        Swal.fire("Success!", "Product added successfully", "success");
      } catch (error) {
        console.error("Error adding product:", error);
        Swal.fire({
          title: "Error!",
          text: `${error.message}`,
          icon: "error",
          confirmButtonColor: "#007d00",
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            handleAddProduct(formValues);
          }
        });
      }
    }
  };

  const handleCreateUser = async (previousValues = {}) => {
    const { value: formValues } = await Swal.fire({
      title: "Create User",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="email" value="${
          previousValues.email || ""
        }">` +
        `<input id="swal-input2" class="swal2-input" placeholder="password" value="${
          previousValues.password || ""
        }">` +
        `<input id="swal-input3" class="swal2-input" placeholder="firstName" value="${
          previousValues.firstName || ""
        }">` +
        `<input id="swal-input4" class="swal2-input" placeholder="lastName" value="${
          previousValues.lastName || ""
        }">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Username" value="${
          previousValues.Username || ""
        }">` +
        `<input id="swal-input6" class="swal2-input" placeholder="PhoneNumber" value="${
          previousValues.PhoneNumber || ""
        }">` +
        `<br>` +
        `<select id="swal-input7" class="swal2-input" value="${
          previousValues.IsAdmin || ""
        }"><option value="false">false</option><option value="true">true</option></select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
      preConfirm: () => {
        const email = document.getElementById("swal-input1").value;
        const password = document.getElementById("swal-input2").value;
        const firstName = document.getElementById("swal-input3").value;
        const lastName = document.getElementById("swal-input4").value;
        const Username = document.getElementById("swal-input5").value;
        const PhoneNumber = document.getElementById("swal-input6").value;
        const IsAdmin = document.getElementById("swal-input7").value;

        if (
          !email ||
          !password ||
          !firstName ||
          !lastName ||
          !Username ||
          !PhoneNumber ||
          !IsAdmin
        ) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }

        return {
          email,
          password,
          firstName,
          lastName,
          Username,
          PhoneNumber,
          IsAdmin,
        };
      },
    });

    if (formValues) {
      try {
        const res = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues), // إرسال formValues مباشرةً
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to create user");
        }

        Swal.fire("Success!", "User created successfully", "success");
      } catch (error) {
        console.error("Error creating user:", error);
        Swal.fire({
          title: "Error!",
          text: `${error.message}`,
          icon: "error",
          confirmButtonColor: "#007d00",
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            handleCreateUser(formValues);
          }
        });
      }
    }
  };

  const handleAddCoupon = async (previousValues = {}) => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Coupon",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="ID" value="${
          previousValues.couponTAG || ""
        }">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Discount (EGP)" value="${
          previousValues.Discount || ""
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
      preConfirm: () => {
        const couponTAG = document.getElementById("swal-input1").value;
        const Discount = document.getElementById("swal-input2").value;

        if (!couponTAG || !Discount) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }
        return {
          couponTAG,
          Discount,
        };
      },
    });

    if (formValues) {
      try {
        const formData = new FormData();
        Object.keys(formValues).forEach((key) => {
          if (key === "tags") {
            formData.append(key, JSON.stringify(formValues[key]));
          } else {
            formData.append(key, formValues[key]);
          }
        });

        const res = await fetch("/api/add/addCoupon", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to add Coupon");
        }

        Swal.fire("Success!", "Coupon added successfully", "success");
      } catch (error) {
        console.error("Error adding Coupon:", error);
        Swal.fire({
          title: "Error!",
          text: `${error.message}`,
          icon: "error",
          confirmButtonColor: "#007d00",
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            handleAddCoupon(formValues);
          }
        });
      }
    }
  };

  const handleUserList = () => {
    router.push("/dashboard/userslist");
  };

  const handleAddJob = async (previousValues = {}) => {
    let imageFile = null;
    let questions = previousValues.questions || [];

    const { value: formValues } = await Swal.fire({
      title: "Add New Job",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Job Name" value="${previousValues.name || ""}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${previousValues.description || ""}</textarea>
        <div id="questions-container" style="margin-top: 20px;">
          ${questions
            .map(
              (question, index) =>
                `<div class="question-item" data-index="${index}">
                  <input class="swal2-input question-input" placeholder="Question" value="${question.content}" style="margin-bottom: 10px;">
                  <button class="remove-question" style="margin-left: 10px;">Remove</button>
                </div>`,
            )
            .join("")}
        </div>
        <button id="add-question-button" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Add Question</button>
        <input id="swal-input5" class="swal2-input" placeholder="Image URL" value="${previousValues.image || ""}">
        <input id="swal-input6" type="file" accept="image/*" style="display: none;">
        <button id="upload-button" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Upload Image</button>
        <div id="image-preview" style="margin-top: 10px;"></div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
      didOpen: () => {
        const addQuestionButton = document.getElementById(
          "add-question-button",
        );
        const questionsContainer = document.getElementById(
          "questions-container",
        );
        const uploadButton = document.getElementById("upload-button");
        const fileInput = document.getElementById("swal-input6");
        const imageUrlInput = document.getElementById("swal-input5");
        const imagePreview = document.getElementById("image-preview");

        // إضافة سؤال جديد
        addQuestionButton.addEventListener("click", () => {
          const index = questions.length;
          questions.push({ content: "" });
          const questionItem = document.createElement("div");
          questionItem.classList.add("question-item");
          questionItem.dataset.index = index;
          questionItem.innerHTML = `
            <input class="swal2-input question-input" placeholder="Question" style="margin-bottom: 10px;">
            <button class="remove-question" style="margin-left: 10px;">Remove</button>
          `;
          questionsContainer.appendChild(questionItem);

          // إضافة منطق لإزالة السؤال
          const removeButton = questionItem.querySelector(".remove-question");
          removeButton.addEventListener("click", () => {
            questions.splice(index, 1);
            questionsContainer.removeChild(questionItem);
          });
        });

        // رفع الصورة
        uploadButton.addEventListener("click", () => {
          fileInput.click();
        });

        fileInput.addEventListener("change", (event) => {
          imageFile = event.target.files[0];
          if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">`;
              imageUrlInput.value = "";
            };
            reader.readAsDataURL(imageFile);
          }
        });

        imageUrlInput.addEventListener("input", () => {
          if (imageUrlInput.value) {
            imagePreview.innerHTML = `<img src="${imageUrlInput.value}" style="max-width: 100%; max-height: 200px;">`;
            imageFile = null;
          } else {
            imagePreview.innerHTML = "";
          }
        });
      },
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const description = document.getElementById("swal-input2").value;
        const imageUrl = document.getElementById("swal-input5").value;

        // قراءة الأسئلة
        const questionInputs = document.querySelectorAll(".question-input");
        questions = Array.from(questionInputs).map((input) => ({
          content: input.value,
        }));

        if (!title || !description || (!imageUrl && !imageFile)) {
          Swal.showValidationMessage(
            "Please fill in all fields and provide an image",
          );
          return false;
        }

        return {
          title,
          description,
          image: imageUrl || "file_upload",
          questions,
        };
      },
    });

    if (formValues) {
      try {
        const formData = new FormData();
        Object.keys(formValues).forEach((key) => {
          if (key === "questions") {
            formData.append(key, JSON.stringify(formValues[key])); // إرسال الأسئلة كـ JSON
          } else {
            formData.append(key, formValues[key]);
          }
        });

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        const res = await fetch("/api/job/addJob", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to add Job");
        }

        Swal.fire("Success!", "Job added successfully", "success");
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `${error.message}`,
          icon: "error",
          confirmButtonColor: "#007d00",
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            handleAddJob(formValues);
          }
        });
      }
    }
  };

  const handleJobList = () => {
    router.push("/dashboard/jobs");
  };

  const handleProductList = () => {
    router.push("/dashboard");
  };

  const handleCouponsList = () => {
    router.push("/dashboard/couponslist");
  };

  const isDashboardPage = pathname?.startsWith("/dashboard");
  if (!isDashboardPage) {
    return null;
  }
  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-64 z-50 lg:z-[1] bg-white p-6 min-h-screen overflow-y-auto text-gray-900 transform ${
          isLgScreen
            ? "translate-x-0"
            : isMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <nav>
          <div
            className={`text-center font-semibold text-xl transform ${isScrolled ? "mt-10" : "mt-0"} transition-all duration-300 ease-in-out mb-10`}
          >
            Dashboard
          </div>
          <ul className="space-y-4">
            <li>
              <DropdownMenu_Products
                title="Products"
                items={[
                  {
                    label: "Add Product",
                    onClick: handleAddProduct,
                    icon: FaPlus,
                  },
                  {
                    label: "Products List",
                    onClick: handleProductList,
                    icon: AiFillProduct,
                  },
                ]}
              />
            </li>
            <li>
              <button
                onClick={() => {
                  router.push("/dashboard/notes");
                }}
                className="flex items-center text-gray-900 hover:text-purple-550"
              >
                <FaNoteSticky className="mr-2" /> Sticky Notes
              </button>
            </li>
            <li>
              <DropdownMenu_users
                title="Users"
                items={[
                  {
                    label: "Create User",
                    onClick: handleCreateUser,
                    icon: FaUserPlus,
                  },
                  { label: "User List", onClick: handleUserList, icon: FaList },
                ]}
              />
            </li>
            <li>
              <DropdownMenu_jobs
                title="Jobs"
                items={[
                  { label: "Create Job", onClick: handleAddJob, icon: MdWork },
                  { label: "Jobs List", onClick: handleJobList, icon: FaList },
                ]}
              />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;
