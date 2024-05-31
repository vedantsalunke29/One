import React, { useState, useEffect } from "react";
import { VscAccount } from "react-icons/vsc";
import axios from "axios";
import Img from "./Img";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsReplyAllFill } from "react-icons/bs";
import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import Cookies from "js-cookie";
import vi from "timeago.js/lib/lang/vi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showNameToNav } from "../store/slices/userNameSlice";

timeago.register("vi", vi);

export default function DiscussionCard({ item }) {
	const [showUserImg, setShowUserImg] = useState(false);
	const [data, setData] = useState([]);
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(item.like);
	const _id = item._id;
	const [regIdNo, setRegIdNo] = useState(Cookies.get("regIdNo"));
	const date = new Date(item.date);
	const [replyInput, setReplyInput] = useState(true);
	const [replyOutput, setReplyOutput] = useState(false);
	const [replyMsg, setReplyMsg] = useState("");
	const [showReply, setShowReply] = useState(false);
	const replyArray = item.replyBy;
	const dispatch = useDispatch();

	const handleClick = () => {
		setLiked(!liked);
	};

	const handleLike = async (count) => {
		try {
			axios
				.post("http://localhost:5000/handle-like", { count, _id, regIdNo })
				.then((res) => {
					if (res.data.message === "done") setLikes(res.data.contain);
				});
		} catch (error) {
			throw new Error(`Error : ${error}`);
		}
	};

	const getLike = async () => {
		try {
			axios.post("http://localhost:5000/get-like", { _id }).then((res) => {
				if (res.data === "fail") {
				}
				setLikes(res.data);
			});
		} catch (error) {
			console.log(error);
		}
	};

	const deleteDiscussion = async () => {
		try {
			axios.post("http://localhost:5000/delete-discussion", {
				_id,
				replyArray,
			});
		} catch (error) {
			throw new Error(`Error : ${error}`);
		}
	};

	const submitReply = async () => {
		try {
			axios
				.post("http://localhost:5000/reply-to-discussion", {
					_id,
					regIdNo,
					replyMsg,
					replyArray,
				})
				.then((res) => {
					if (res.data.message === "done") {
						toast.success("success");
						setReplyInput(false);
						dispatch(showNameToNav(replyInput));
						setData(res.data.contain);
						setShowReply(true);
					}
				});
		} catch (error) {
			throw new Error(`Error : ${error}`);
		}
	};

	const getReply = async () => {
		try {
			axios
				.post("http://localhost:5000/get-reply-to-discussion", {
					replyArray,
					_id,
				})
				.then((res) => {
					if (res.data === "fail") {
						setShowReply(false);
					} else {
						setData(res.data);
						setShowReply(true);
					}
				});
		} catch (error) {
			setShowReply(false);
			throw new Error(`Error : ${error}`);
		}
	};

	const handleReply = () => {
		setReplyOutput(!replyOutput);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			const updatedCookie = Cookies.get("regIdNo");
			if (updatedCookie !== regIdNo) setRegIdNo(updatedCookie);
		}, 1000);

		return () => clearInterval(interval);
	}, [regIdNo]);

	useEffect(() => {
		if (item.userImg === "notexist") setShowUserImg(false);
		else setShowUserImg(true);
		if (replyArray.length) getReply();
	}, [item]);

	useEffect(() => {
		if (
			item.like &&
			item.likeBy.find((ID) => {
				return ID === regIdNo;
			})
		)
			setLiked(true);

		if (
			date.getDate() < new Date().getDate() &&
			date.getMonth() < new Date().getMonth()
		)
			deleteDiscussion();
	}, []);

	return (
		<>
			<div className="main-container-for-post">
				<div className="uploader-info-div">
					{showUserImg && <Img img={item.userImg} />}
					{!showUserImg && <VscAccount />}
					<div className="uploader-inner-info-div">
						<h3>{item.name}</h3>
						<p>
							<TimeAgo datetime={item.date} />
						</p>
					</div>
				</div>
				<div className="uploader-message-div">
					<h2>{item.discussMsg}</h2>
				</div>
				<div className="lower-uploader-like-reply-div">
					<div className="like-div">
						<p> {likes}</p>
						{!liked && (
							<>
								<FcLikePlaceholder
									onClick={() => {
										handleClick();
										handleLike(1);
									}}
								/>
							</>
						)}
						{liked && (
							<>
								<FcLike
									onClick={() => {
										handleClick();
										handleLike(-1);
									}}
								/>
							</>
						)}
					</div>
					<div
						className="reply-div"
						onClick={handleReply}
					>
						<p> {item.reply}</p>
						<BsReplyAllFill />
					</div>
				</div>
				{replyOutput && (
					<div className="main-reply-container-div">
						{replyInput && (
							<div className="main-reply-input-take-div">
								<textarea
									value={replyMsg}
									onChange={(e) => {
										setReplyMsg(e.target.value);
									}}
									className="input-new-discuss"
								></textarea>
								<button
									className="button-27"
									onClick={submitReply}
								>
									Submit
								</button>
							</div>
						)}
						{showReply && (
							<div className="reply-contain-div">
								{data.map((item) => {
									return (
										<DiscussionCard
											item={item}
											key={item._id}
										/>
									);
								})}
							</div>
						)}
						{!showReply && <h1 className="no-reply-div">No reply</h1>}
					</div>
				)}
			</div>
		</>
	);
}
