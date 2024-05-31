import React, { useEffect, useState } from "react";
import Img from "./Img";
import axios from "axios";
import video from "../assets/empty.mp4";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import Loader from "./Loader";

export default function DisplayProduct() {
	let settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
	};
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showCard, setShowCard] = useState(false);
	const [showDesc, setShowDesc] = useState(false);
	const [mailBox, setMailBox] = useState(false);
	const [buyerEmail, setBuyerEmail] = useState("");
	const [ownerEmail, setOwnerEmail] = useState("");
	const [productName, setProductName] = useState("");

	const showProduct = async (_id) => {
		try {
			await axios
				.post("https://one-jc5d.onrender.com/product-info", { _id })
				.then((res) => {
					if (res.data === "not") setShowCard(false);
					else {
						setData(res.data);
						setShowCard(true);
					}
				});
		} catch (error) {
			throw new Error(`ERROR:${error}`);
		}
	};

	const contactOwner = () => {
		setMailBox(!mailBox);
		setOwnerEmail(data[0].contactInfo);
		setProductName(data[0].productName);
	};

	useEffect(() => {
		let id = JSON.parse(sessionStorage.getItem("ProductInfo"));
		showProduct(id);
	}, []);

	const showDescription = () => {
		setShowDesc(!showDesc);
	};

	const buyRequest = async () => {
		setIsLoading(true);
		try {
			await axios
				.post("https://one-jc5d.onrender.com/buy-request", {
					buyerEmail,
					ownerEmail,
					productName,
				})
				.then((res) => {
					if (res.data === "done") {
						setMailBox(false);
						toast.success("Request Sent successfully");
						setBuyerEmail("");
						setIsLoading(false);
					} else {
						toast.error("Something went wrong");
						setIsLoading(false);
					}
				});
		} catch (error) {
			setIsLoading(false);
			throw new Error(`ERROR:${error}`);
		}
	};

	return (
		<>
			{showCard && (
				<>
					{" "}
					{isLoading && <Loader />}
					<div className="background-for-product">
						<div className="main-display-page-product-div">
							<div className="upper-div">
								<div className="about-prod-info">
									<h4 className="heading-item">About this product</h4>
								</div>

								<div className="about-prod-image">
									<div className="card-slider-image">
										{data[0].img.length > 1 ? (
											<Slider {...settings}>
												{data[0].img?.map((i) => {
													return (
														<div className="image-div">
															<Img img={i} />
														</div>
													);
												})}
											</Slider>
										) : (
											<div className="image-div">
												<Img img={data[0].img[0]} />
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="middle-div">
								<div
									className="button-54"
									onClick={() => {
										showDescription();
									}}
								>
									Description
								</div>
								{showDesc && (
									<>
										<div className="about-prod-desc-info">
											<div className="information-div-main">
												<div className="product-info-div">
													<h2 className="h2-title-div">Product Info</h2>
													<p className="p-div">
														<b>Product Name</b> {data[0].productName}
													</p>
													<p className="p-div-info">
														<b>Info</b> {data[0].description}
													</p>
												</div>
												<div className="seller-info-div">
													<h2 className="h2-title-div">Seller Info</h2>

													<p className="p-div">
														<b>Owner Name</b>
														{data[1]}
													</p>
													<p className="p-div">
														<b>Interested to buy ?</b>
														{mailBox && (
															<>
																<div className="p-div">Enter Your Mail</div>
																<input
																	type="email"
																	className="user-mail-input"
																	required
																	value={buyerEmail}
																	onChange={(e) => {
																		setBuyerEmail(e.target.value);
																	}}
																/>
																<button
																	className="button-30"
																	onClick={buyRequest}
																>
																	Send
																</button>
															</>
														)}
														{!mailBox && (
															<button
																className="button-30"
																onClick={contactOwner}
															>
																Contact
															</button>
														)}
													</p>
												</div>
											</div>
											<h3 className="price-tag">
												Price : ₹ {data[0].productPrice}{" "}
											</h3>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</>
			)}

			{!showCard && (
				<div className="nothing-to-dis">
					<video
						autoPlay
						muted
						loop
						className="video"
					>
						<source
							src={video}
							type="video/mp4"
						/>
						Sorry, your browser doesn't support videos.
					</video>
				</div>
			)}
		</>
	);
}
