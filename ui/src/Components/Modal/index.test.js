import React from "react";

import { mount } from "enzyme";

import { Modal } from ".";

const fakeToggle = jest.fn();

const MountedModal = (isOpen) => {
  return mount(
    <Modal isOpen={isOpen} toggleOpen={fakeToggle}>
      <div />
    </Modal>
  );
};

afterEach(() => {
  jest.resetAllMocks();
  document.body.className = "";
});

describe("<Modal />", () => {
  it("'modal-open' class is appended to MountModal container", () => {
    const tree = MountedModal(true);
    expect(tree.find("div").at(0).hasClass("modal-open")).toBe(true);
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    MountedModal(true);
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is not removed from body node after hidden modal is unmounted", () => {
    document.body.classList.add("modal-open");
    const tree = MountedModal(false);
    tree.unmount();
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
    const tree = MountedModal(true);
    tree.unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is not removed from body when hidden modal is updated", () => {
    document.body.classList.toggle("modal-open", true);
    const tree = MountedModal(false);
    expect(document.body.className.split(" ")).toContain("modal-open");
    // force update
    tree.setProps({ style: {} });
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body when visible modal is updated to be hidden", () => {
    document.body.classList.toggle("modal-open", true);
    let isOpen = true;
    const tree = MountedModal(isOpen);
    expect(document.body.className.split(" ")).toContain("modal-open");

    tree.setProps({ isOpen: false });
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("passes extra props down to the MountModal animation component", () => {
    const onExited = jest.fn();
    const tree = mount(
      <Modal isOpen={true} toggleOpen={fakeToggle} onExited={onExited}>
        <div />
      </Modal>
    );
    const mountModal = tree.find("MountModal");
    expect(mountModal.props().onExited).toBe(onExited);
  });

  it("toggleOpen is called after pressing 'esc'", () => {
    const tree = MountedModal(true);
    tree
      .find("div")
      .at(0)
      .simulate("keyDown", { key: "Escape", keyCode: 27, which: 27 });
    expect(fakeToggle).toHaveBeenCalled();
  });
});
